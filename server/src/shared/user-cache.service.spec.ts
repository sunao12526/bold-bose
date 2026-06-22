import { Test, TestingModule } from '@nestjs/testing';
import { UserCacheService } from './user-cache.service';
import { PrismaService } from './prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    clear: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCacheService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
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
      mockCacheManager.get.mockResolvedValue(mockAuth);

      const res = await service.getUserAuth(1);

      expect(res).toEqual(mockAuth);
      expect(mockCacheManager.get).toHaveBeenCalledWith('user_auth:1');
      expect(mockPrismaService.userRole.findMany).not.toHaveBeenCalled();
    });

    it('如果缓存中不存在，且用户是超级管理员，应该查询数据库并写入缓存', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      
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
      expect(mockCacheManager.set).toHaveBeenCalledWith('user_auth:2', {
        roleCodes: ['super_admin'],
        permissions: [],
        isSuperAdmin: true,
      }, 300000);
    });

    it('如果缓存中不存在，且用户是普通管理员，应该查询关联菜单权限并写入缓存', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      
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
      expect(mockCacheManager.set).toHaveBeenCalledWith('user_auth:3', {
        roleCodes: ['admin'],
        permissions: ['sys:user:create', 'sys:user:edit'],
        isSuperAdmin: false,
      }, 300000);
    });

    it('如果在读取或写入缓存时抛出异常，应该优雅捕获不崩溃', async () => {
      mockCacheManager.get.mockRejectedValue(new Error('Cache read error'));
      mockCacheManager.set.mockRejectedValue(new Error('Cache write error'));
      
      mockPrismaService.userRole.findMany.mockResolvedValue([]);

      const res = await service.getUserAuth(4);
      expect(res.isSuperAdmin).toBe(false); // 仍然能返回
    });
  });

  describe('invalidateUser', () => {
    it('应该从缓存中删除指定用户的数据', async () => {
      mockCacheManager.del.mockResolvedValue(undefined);

      await service.invalidateUser(5);

      expect(mockCacheManager.del).toHaveBeenCalledWith('user_auth:5');
    });

    it('如果删除发生异常，应该捕获并记录', async () => {
      mockCacheManager.del.mockRejectedValue(new Error('Cache del error'));
      await expect(service.invalidateUser(5)).resolves.not.toThrow();
    });
  });

  describe('invalidateAll', () => {
    it('如果支持 clear 方法，应该调用 clear', async () => {
      mockCacheManager.clear.mockResolvedValue(undefined);

      await service.invalidateAll();

      expect(mockCacheManager.clear).toHaveBeenCalled();
      expect(mockCacheManager.reset).not.toHaveBeenCalled();
    });

    it('如果不支持 clear 但支持 reset，应该调用 reset', async () => {
      const cacheManagerWithoutClear = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        reset: jest.fn().mockResolvedValue(undefined),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserCacheService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: CACHE_MANAGER, useValue: cacheManagerWithoutClear },
        ],
      }).compile();

      const newService = module.get<UserCacheService>(UserCacheService);
      await newService.invalidateAll();

      expect(cacheManagerWithoutClear.reset).toHaveBeenCalled();
    });
  });
});
