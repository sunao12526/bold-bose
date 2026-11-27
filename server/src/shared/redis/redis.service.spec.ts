import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

describe('RedisService (Memory Fallback & Lock/Throttle Semantics)', () => {
  let service: RedisService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'REDIS_KEY_PREFIX') return 'test:';
      return undefined;
    }),
  } as unknown as ConfigService;

  beforeEach(() => {
    service = new RedisService(mockConfigService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
    jest.restoreAllMocks();
  });

  it('未连接 Redis 时应平滑降级为内存模式并支持基础读写', async () => {
    expect(service.isRedisReady()).toBe(false);
    await service.set('k1', 'v1', 5000);
    expect(await service.get('k1')).toBe('v1');

    await service.setJson('obj1', { a: 1, b: 'x' }, 5000);
    expect(await service.getJson<{ a: number; b: string }>('obj1')).toEqual({
      a: 1,
      b: 'x',
    });

    const info = await service.getInfo();
    expect(info.mode).toBe('memory');
  });

  it('TTL 过期后应返回 null，且传入 <= 0 的 TTL 应立即清理键', async () => {
    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValue(1000);
    await service.set('exp_key', 'val', 100);
    expect(await service.get('exp_key')).toBe('val');

    nowSpy.mockReturnValue(1101);
    expect(await service.get('exp_key')).toBeNull();

    await service.set('zero_ttl', 'val');
    await service.set('zero_ttl', 'val2', 0);
    expect(await service.get('zero_ttl')).toBeNull();
  });

  it('getAndDelete 应该原子读取并删除键（仅消费一次）', async () => {
    await service.set('once', 'secret', 5000);
    expect(await service.getAndDelete('once')).toBe('secret');
    expect(await service.getAndDelete('once')).toBeNull();
  });

  it('delByPattern 应该仅删除匹配通配符模式的键', async () => {
    await service.set('user_auth:1', 'a');
    await service.set('user_auth:2', 'b');
    await service.set('other:1', 'c');

    const count = await service.delByPattern('user_auth:*');
    expect(count).toBe(2);
    expect(await service.get('user_auth:1')).toBeNull();
    expect(await service.get('user_auth:2')).toBeNull();
    expect(await service.get('other:1')).toBe('c');
  });

  it('acquireLock 与 releaseLock 应该校验 token 防止误删他人持有的锁', async () => {
    const token1 = await service.acquireLock('lock:job:1', 5000);
    expect(token1).toBeTruthy();

    // 锁已被占用时，第二次抢锁失败
    const token2 = await service.acquireLock('lock:job:1', 5000);
    expect(token2).toBeNull();

    // 使用错误的 token 无法释放
    expect(await service.releaseLock('lock:job:1', 'wrong-token')).toBe(false);
    expect(await service.acquireLock('lock:job:1', 5000)).toBeNull();

    // 使用正确的 token 释放成功，之后可再次抢锁
    expect(await service.releaseLock('lock:job:1', token1!)).toBe(true);
    const token3 = await service.acquireLock('lock:job:1', 5000);
    expect(token3).toBeTruthy();
  });

  it('withLock 在持有锁时执行回调并在结束后释放，未抢到锁时跳过执行', async () => {
    const existingToken = await service.acquireLock('lock:res:1', 5000);
    const skipped = await service.withLock('lock:res:1', 5000, async () => 'ran');
    expect(skipped).toEqual({ acquired: false });

    await service.releaseLock('lock:res:1', existingToken!);
    const executed = await service.withLock('lock:res:1', 5000, async () => 'done');
    expect(executed).toEqual({ acquired: true, result: 'done' });

    // 执行完成后锁已释放
    const nextToken = await service.acquireLock('lock:res:1', 5000);
    expect(nextToken).toBeTruthy();
  });

  it('evalThrottle 应该准确计数、触发限流封禁并在封禁过期后恢复', async () => {
    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValue(10_000);

    const r1 = await service.evalThrottle('ip:1', 10_000, 2, 30_000);
    expect(r1.totalHits).toBe(1);
    expect(r1.isBlocked).toBe(false);

    const r2 = await service.evalThrottle('ip:1', 10_000, 2, 30_000);
    expect(r2.totalHits).toBe(2);
    expect(r2.isBlocked).toBe(false);

    const r3 = await service.evalThrottle('ip:1', 10_000, 2, 30_000);
    expect(r3.totalHits).toBe(3);
    expect(r3.isBlocked).toBe(true);
    expect(r3.timeToBlockExpire).toBe(30);

    // 封禁期间继续请求保持 blocked
    nowSpy.mockReturnValue(25_000);
    const r4 = await service.evalThrottle('ip:1', 10_000, 2, 30_000);
    expect(r4.isBlocked).toBe(true);
    expect(r4.timeToBlockExpire).toBe(15);

    // 封禁和窗口均过期后恢复正常
    nowSpy.mockReturnValue(45_000);
    const r5 = await service.evalThrottle('ip:1', 10_000, 2, 30_000);
    expect(r5.totalHits).toBe(1);
    expect(r5.isBlocked).toBe(false);
  });
});
