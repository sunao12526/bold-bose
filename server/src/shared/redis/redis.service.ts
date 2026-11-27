import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as crypto from 'crypto';

interface MemoryEntry {
  value: string;
  expiresAt?: number;
}

export interface ThrottleResult {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

export interface RedisInfoResult {
  mode: 'redis' | 'memory';
  status: string;
  dbSize?: number;
  info?: Record<string, string>;
}

const GET_AND_DELETE_LUA = `
local val = redis.call('get', KEYS[1])
if val then
  redis.call('del', KEYS[1])
end
return val
`;

const RELEASE_LOCK_LUA = `
if redis.call('get', KEYS[1]) == ARGV[1] then
  return redis.call('del', KEYS[1])
else
  return 0
end
`;

const EVAL_THROTTLE_LUA = `
local hitKey = KEYS[1]
local blockKey = KEYS[2]
local ttlMs = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local blockDurationMs = tonumber(ARGV[3])

local blockPttl = redis.call('pttl', blockKey)
if blockPttl > 0 then
  local hitPttl = redis.call('pttl', hitKey)
  if hitPttl < 0 then hitPttl = 0 end
  return { limit + 1, math.ceil(hitPttl / 1000), 1, math.ceil(blockPttl / 1000) }
end

local hits = redis.call('incr', hitKey)
local hitPttl = redis.call('pttl', hitKey)
if hits == 1 or hitPttl < 0 then
  redis.call('pexpire', hitKey, ttlMs)
  hitPttl = ttlMs
end

local isBlocked = 0
local timeToBlockExpire = 0
if hits > limit then
  isBlocked = 1
  if blockDurationMs > 0 then
    redis.call('psetex', blockKey, blockDurationMs, '1')
    timeToBlockExpire = math.ceil(blockDurationMs / 1000)
  end
end

return { hits, math.ceil(hitPttl / 1000), isBlocked, timeToBlockExpire }
`;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private redisReady = false;
  private readonly keyPrefix: string;
  private readonly memoryStore = new Map<string, MemoryEntry>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(private readonly configService: ConfigService) {
    this.keyPrefix =
      this.configService.get<string>('REDIS_KEY_PREFIX') ?? 'bold_bose:';
  }

  async onModuleInit(): Promise<void> {
    this.cleanupTimer = setInterval(() => this.cleanupExpiredMemory(), 60_000);
    this.cleanupTimer.unref();

    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = Number(this.configService.get<string>('REDIS_PORT') || 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;
    const db = Number(this.configService.get<string>('REDIS_DB') || 0);

    const client = new Redis({
      host,
      port,
      password: password || undefined,
      db,
      keyPrefix: this.keyPrefix,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: (times: number) => {
        if (times > 5) {
          return null;
        }
        return Math.min(times * 500, 3000);
      },
    });

    client.on('ready', () => {
      this.redisReady = true;
      this.logger.log(`Redis connected (${host}:${port}, db=${db})`);
    });

    client.on('close', () => {
      this.redisReady = false;
    });

    client.on('end', () => {
      this.redisReady = false;
    });

    client.on('error', (err: Error) => {
      this.redisReady = false;
      this.logger.warn(`Redis error, falling back to memory store: ${err.message}`);
    });

    this.client = client;

    try {
      await client.connect();
    } catch (err: any) {
      this.redisReady = false;
      this.logger.warn(
        `Redis unavailable at startup (${host}:${port}), using in-memory fallback: ${err?.message || err}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    if (this.client) {
      try {
        this.client.disconnect();
      } catch {
        // ignore disconnect errors during shutdown
      }
      this.client = null;
    }
    this.redisReady = false;
  }

  isRedisReady(): boolean {
    return this.redisReady && this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (this.isRedisReady()) {
      try {
        return await this.client!.get(key);
      } catch (err: any) {
        this.logger.warn(`Redis GET failed for ${key}: ${err.message}`);
      }
    }
    return this.getFromMemory(key);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    if (ttlMs !== undefined && ttlMs <= 0) {
      await this.del(key);
      return;
    }

    if (this.isRedisReady()) {
      try {
        if (ttlMs !== undefined) {
          await this.client!.set(key, value, 'PX', Math.floor(ttlMs));
        } else {
          await this.client!.set(key, value);
        }
        return;
      } catch (err: any) {
        this.logger.warn(`Redis SET failed for ${key}: ${err.message}`);
      }
    }

    this.setInMemory(key, value, ttlMs);
  }

  async setJson(key: string, value: unknown, ttlMs?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlMs);
  }

  async getAndDelete(key: string): Promise<string | null> {
    if (this.isRedisReady()) {
      try {
        const res = await this.client!.eval(GET_AND_DELETE_LUA, 1, key);
        return typeof res === 'string' ? res : null;
      } catch (err: any) {
        this.logger.warn(`Redis getAndDelete failed for ${key}: ${err.message}`);
      }
    }

    const val = this.getFromMemory(key);
    if (val !== null) {
      this.memoryStore.delete(key);
    }
    return val;
  }

  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;

    if (this.isRedisReady()) {
      try {
        return await this.client!.del(...keys);
      } catch (err: any) {
        this.logger.warn(`Redis DEL failed: ${err.message}`);
      }
    }

    let deleted = 0;
    for (const k of keys) {
      if (this.memoryStore.delete(k)) {
        deleted += 1;
      }
    }
    return deleted;
  }

  async delByPattern(pattern: string): Promise<number> {
    if (this.isRedisReady()) {
      try {
        let cursor = '0';
        let totalDeleted = 0;
        const matchPattern = `${this.keyPrefix}${pattern}`;

        do {
          const [nextCursor, foundKeys] = await this.client!.scan(
            cursor,
            'MATCH',
            matchPattern,
            'COUNT',
            100,
          );
          cursor = nextCursor;

          if (foundKeys.length > 0) {
            const unprefixed = foundKeys.map((k) =>
              this.keyPrefix && k.startsWith(this.keyPrefix)
                ? k.slice(this.keyPrefix.length)
                : k,
            );
            totalDeleted += await this.client!.del(...unprefixed);
          }
        } while (cursor !== '0');

        return totalDeleted;
      } catch (err: any) {
        this.logger.warn(`Redis delByPattern failed for ${pattern}: ${err.message}`);
      }
    }

    const regex = this.globToRegExp(pattern);
    let count = 0;
    for (const k of Array.from(this.memoryStore.keys())) {
      if (regex.test(k)) {
        this.memoryStore.delete(k);
        count += 1;
      }
    }
    return count;
  }

  async setNx(key: string, value: string, ttlMs: number): Promise<boolean> {
    const safeTtl = Math.max(1, Math.floor(ttlMs));

    if (this.isRedisReady()) {
      try {
        const res = await this.client!.set(key, value, 'PX', safeTtl, 'NX');
        return res === 'OK';
      } catch (err: any) {
        this.logger.warn(`Redis setNx failed for ${key}: ${err.message}`);
      }
    }

    const existing = this.getFromMemory(key);
    if (existing !== null) {
      return false;
    }
    this.setInMemory(key, value, safeTtl);
    return true;
  }

  async acquireLock(lockKey: string, ttlMs: number): Promise<string | null> {
    const token = crypto.randomUUID();
    const acquired = await this.setNx(lockKey, token, ttlMs);
    return acquired ? token : null;
  }

  async releaseLock(lockKey: string, token: string): Promise<boolean> {
    if (!token) return false;

    if (this.isRedisReady()) {
      try {
        const res = await this.client!.eval(RELEASE_LOCK_LUA, 1, lockKey, token);
        return Number(res) === 1;
      } catch (err: any) {
        this.logger.warn(`Redis releaseLock failed for ${lockKey}: ${err.message}`);
      }
    }

    const current = this.getFromMemory(lockKey);
    if (current === token) {
      this.memoryStore.delete(lockKey);
      return true;
    }
    return false;
  }

  async withLock<T>(
    lockKey: string,
    ttlMs: number,
    fn: () => Promise<T>,
  ): Promise<{ acquired: boolean; result?: T }> {
    const token = await this.acquireLock(lockKey, ttlMs);
    if (!token) {
      return { acquired: false };
    }
    try {
      const result = await fn();
      return { acquired: true, result };
    } finally {
      await this.releaseLock(lockKey, token);
    }
  }

  async evalThrottle(
    key: string,
    ttlMs: number,
    limit: number,
    blockDurationMs: number,
  ): Promise<ThrottleResult> {
    const hitKey = `throttle:hits:${key}`;
    const blockKey = `throttle:block:${key}`;
    const safeTtlMs = Math.max(1, Math.floor(ttlMs));
    const safeBlockMs = Math.max(0, Math.floor(blockDurationMs));

    if (this.isRedisReady()) {
      try {
        const res = (await this.client!.eval(
          EVAL_THROTTLE_LUA,
          2,
          hitKey,
          blockKey,
          safeTtlMs,
          limit,
          safeBlockMs,
        )) as [number, number, number, number];
        return {
          totalHits: Number(res[0]),
          timeToExpire: Math.max(0, Number(res[1])),
          isBlocked: Number(res[2]) === 1,
          timeToBlockExpire: Math.max(0, Number(res[3])),
        };
      } catch (err: any) {
        this.logger.warn(`Redis evalThrottle failed for ${key}: ${err.message}`);
      }
    }

    return this.evalThrottleInMemory(hitKey, blockKey, safeTtlMs, limit, safeBlockMs);
  }

  async getInfo(): Promise<RedisInfoResult> {
    if (this.isRedisReady()) {
      try {
        const [dbSize, rawInfo] = await Promise.all([
          this.client!.dbsize(),
          this.client!.info(),
        ]);
        const info: Record<string, string> = {};
        for (const line of rawInfo.split(/\r?\n/)) {
          if (!line || line.startsWith('#')) continue;
          const idx = line.indexOf(':');
          if (idx > 0) {
            info[line.slice(0, idx)] = line.slice(idx + 1).trim();
          }
        }
        return {
          mode: 'redis',
          status: this.client!.status,
          dbSize,
          info,
        };
      } catch (err: any) {
        this.logger.warn(`Redis getInfo failed: ${err.message}`);
      }
    }

    this.cleanupExpiredMemory();
    return {
      mode: 'memory',
      status: 'fallback_memory',
      dbSize: this.memoryStore.size,
    };
  }

  private getFromMemory(key: string): string | null {
    const entry = this.memoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
      this.memoryStore.delete(key);
      return null;
    }
    return entry.value;
  }

  private setInMemory(key: string, value: string, ttlMs?: number): void {
    const expiresAt =
      ttlMs !== undefined ? Date.now() + Math.floor(ttlMs) : undefined;
    this.memoryStore.set(key, { value, expiresAt });
  }

  private evalThrottleInMemory(
    hitKey: string,
    blockKey: string,
    ttlMs: number,
    limit: number,
    blockDurationMs: number,
  ): ThrottleResult {
    const now = Date.now();
    const blockEntry = this.memoryStore.get(blockKey);
    if (blockEntry && blockEntry.expiresAt && blockEntry.expiresAt > now) {
      const hitEntry = this.memoryStore.get(hitKey);
      const hitRemaining =
        hitEntry?.expiresAt && hitEntry.expiresAt > now
          ? hitEntry.expiresAt - now
          : 0;
      return {
        totalHits: limit + 1,
        timeToExpire: Math.ceil(hitRemaining / 1000),
        isBlocked: true,
        timeToBlockExpire: Math.ceil((blockEntry.expiresAt - now) / 1000),
      };
    }
    this.memoryStore.delete(blockKey);

    const existingHit = this.memoryStore.get(hitKey);
    let hits = 1;
    let expiresAt = now + ttlMs;
    if (existingHit && (!existingHit.expiresAt || existingHit.expiresAt > now)) {
      hits = Number(existingHit.value) + 1;
      expiresAt = existingHit.expiresAt ?? now + ttlMs;
    }
    this.memoryStore.set(hitKey, { value: String(hits), expiresAt });

    let isBlocked = false;
    let timeToBlockExpire = 0;
    if (hits > limit) {
      isBlocked = true;
      if (blockDurationMs > 0) {
        this.memoryStore.set(blockKey, {
          value: '1',
          expiresAt: now + blockDurationMs,
        });
        timeToBlockExpire = Math.ceil(blockDurationMs / 1000);
      }
    }

    return {
      totalHits: hits,
      timeToExpire: Math.ceil((expiresAt - now) / 1000),
      isBlocked,
      timeToBlockExpire,
    };
  }

  private cleanupExpiredMemory(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryStore.entries()) {
      if (entry.expiresAt !== undefined && entry.expiresAt <= now) {
        this.memoryStore.delete(key);
      }
    }
  }

  private globToRegExp(pattern: string): RegExp {
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');
    return new RegExp(`^${escaped}$`);
  }
}
