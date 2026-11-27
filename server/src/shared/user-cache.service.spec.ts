import { Test, TestingModule } from '@nestjs/testing';
import { UserCacheService } from './user-cache.service';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

describe('UserCacheService', () => {
  let service: UserCacheService;

  const mockPrismaService = {
    userRole: {
      findMany: jest.fn(),
    },
    roleMenu: {
      findMany: jest.fn(),
    },
  };

  const mockRedisService = {
    getJson: jest.fn(),
    setJson: jest.fn(),
    del: jest.fn(),
    delByPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCacheService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<UserCacheService>(UserCacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserAuth', () => {
    it('如果缓存中存在数据，应该直接返回缓存数据且不查询数据库', async () => {
      const mockAuth = {
        roleCodes: ['admin'],
        permissions: ['sys:user:list'],
        isSuperAdmin: false,
      };
      mockRedisService.getJson.mockResolvedValue(mockAuth);

      const res = await service.getUserAuth(1);

      expect(res).toEqual(mockAuth);
      expect(mockRedisService.getJson).toHaveBeenCalledWith('user_auth:1');
      expect(mockPrismaService.userRole.findMany).not.toHaveBeenCalled();
    });

    it('如果缓存中不存在，且用户是超级管理员，应该查询数据库并写入缓存', async () => {
      mockRedisService.getJson.mockResolvedValue(null);

      const userRoles = [
        { roleId: 1, role: { code: 'super_admin' } },
      ];
      mockPrismaService.userRole.findMany.mockResolvedValue(userRoles);

      const res = await service.getUserAuth(2);

      expect(res).toEqual({
        roleCodes: ['super_admin'],
        permissions: [],
        isSuperAdmin: true,
      });
      expect(mockPrismaService.userRole.findMany).toHaveBeenCalledWith({
        where: { userId: 2 },
        include: { role: true },
      });
      expect(mockPrismaService.roleMenu.findMany).not.toHaveBeenCalled();
      expect(mockRedisService.setJson).toHaveBeenCalledWith(
        'user_auth:2',
        {
          roleCodes: ['super_admin'],
          permissions: [],
          isSuperAdmin: true,
        },
        300000,
      );
    });

    it('如果缓存中不存在，且用户是普通管理员，应该查询关联菜单权限并写入缓存', async () => {
      mockRedisService.getJson.mockResolvedValue(null);

      const userRoles = [
        { roleId: 2, role: { code: 'admin' } },
      ];
      const roleMenus = [
        { menu: { permission: 'sys:user:create' } },
        { menu: { permission: 'sys:user:edit' } },
        { menu: { permission: null } }, // 空值过滤
      ];
      mockPrismaService.userRole.findMany.mockResolvedValue(userRoles);
      mockPrismaService.roleMenu.findMany.mockResolvedValue(roleMenus);

      const res = await service.getUserAuth(3);

      expect(res).toEqual({
        roleCodes: ['admin'],
        permissions: ['sys:user:create', 'sys:user:edit'],
        isSuperAdmin: false,
      });
      expect(mockPrismaService.roleMenu.findMany).toHaveBeenCalledWith({
        where: { roleId: { in: [2] } },
        include: { menu: true },
      });
      expect(mockRedisService.setJson).toHaveBeenCalledWith(
        'user_auth:3',
        {
          roleCodes: ['admin'],
          permissions: ['sys:user:create', 'sys:user:edit'],
          isSuperAdmin: false,
        },
        300000,
      );
    });

    it('如果在读取或写入缓存时抛出异常，应该优雅捕获不崩溃', async () => {
      mockRedisService.getJson.mockRejectedValue(new Error('Cache read error'));
      mockRedisService.setJson.mockRejectedValue(new Error('Cache write error'));

      mockPrismaService.userRole.findMany.mockResolvedValue([]);

      const res = await service.getUserAuth(4);
      expect(res.isSuperAdmin).toBe(false); // 仍然能返回
    });
  });

  describe('invalidateUser', () => {
    it('应该从缓存中删除指定用户的数据', async () => {
      mockRedisService.del.mockResolvedValue(1);

      await service.invalidateUser(5);

      expect(mockRedisService.del).toHaveBeenCalledWith('user_auth:5');
    });

    it('如果删除发生异常，应该捕获并记录', async () => {
      mockRedisService.del.mockRejectedValue(new Error('Cache del error'));
      await expect(service.invalidateUser(5)).resolves.not.toThrow();
    });
  });

  describe('invalidateAll', () => {
    it('应该按模式删除所有 user_auth:* 缓存', async () => {
      mockRedisService.delByPattern.mockResolvedValue(3);

      await service.invalidateAll();

      expect(mockRedisService.delByPattern).toHaveBeenCalledWith('user_auth:*');
    });

    it('如果清理发生异常，应该安全捕获', async () => {
      mockRedisService.delByPattern.mockRejectedValue(new Error('Scan error'));
      await expect(service.invalidateAll()).resolves.not.toThrow();
    });
  });
});
