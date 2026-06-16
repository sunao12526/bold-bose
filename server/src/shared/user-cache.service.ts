import { Injectable, Global, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

interface CachedUserAuth {
  roleCodes: string[];
  permissions: string[];
  isSuperAdmin: boolean;
  expiresAt: number;
}

@Global()
@Injectable()
export class UserCacheService {
  private readonly logger = new Logger(UserCacheService.name);
  private cache = new Map<number, CachedUserAuth>();
  private readonly TTL = 5 * 60 * 1000;

  constructor(private prisma: PrismaService) {}

  async getUserAuth(userId: number): Promise<CachedUserAuth> {
    this.cleanup();
    const cached = this.cache.get(userId);
    if (cached && Date.now() < cached.expiresAt) {
      return cached;
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
      expiresAt: Date.now() + this.TTL,
    };

    this.cache.set(userId, auth);
    return auth;
  }

  invalidateUser(userId: number): void {
    this.cache.delete(userId);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [userId, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(userId);
      }
    }
  }
}
