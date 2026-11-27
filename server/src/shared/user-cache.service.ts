import { Injectable, Global, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

interface CachedUserAuth {
  roleCodes: string[];
  permissions: string[];
  isSuperAdmin: boolean;
}

@Global()
@Injectable()
export class UserCacheService {
  private readonly logger = new Logger(UserCacheService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async getUserAuth(userId: number): Promise<CachedUserAuth> {
    const cacheKey = `user_auth:${userId}`;

    try {
      const cached = await this.redisService.getJson<CachedUserAuth>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch (err) {
      this.logger.error(`Failed to get cache for user ${userId}:`, err);
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    const roleCodes = userRoles.map((ur) => ur.role.code);
    const isSuperAdmin = roleCodes.includes('super_admin');

    let permissions: string[] = [];
    if (!isSuperAdmin) {
      const roleIds = userRoles.map((ur) => ur.roleId);
      if (roleIds.length > 0) {
        const roleMenus = await this.prisma.roleMenu.findMany({
          where: { roleId: { in: roleIds } },
          include: { menu: true },
        });
        permissions = roleMenus
          .map((rm) => rm.menu.permission)
          .filter((p): p is string => !!p);
      }
    }

    const auth: CachedUserAuth = {
      roleCodes,
      permissions,
      isSuperAdmin,
    };

    try {
      // TTL set to 5 minutes (300,000 milliseconds)
      await this.redisService.setJson(cacheKey, auth, 300000);
    } catch (err) {
      this.logger.error(`Failed to set cache for user ${userId}:`, err);
    }

    return auth;
  }

  async invalidateUser(userId: number): Promise<void> {
    const cacheKey = `user_auth:${userId}`;
    try {
      await this.redisService.del(cacheKey);
    } catch (err) {
      this.logger.error(`Failed to invalidate cache for user ${userId}:`, err);
    }
  }

  async invalidateAll(): Promise<void> {
    try {
      await this.redisService.delByPattern('user_auth:*');
    } catch (err) {
      this.logger.error('Failed to clear cache:', err);
    }
  }
}
