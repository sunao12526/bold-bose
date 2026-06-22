import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserCacheService } from '../../shared/user-cache.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    loginLog: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    userSession: {
      create: jest.fn(),
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
    },
    userRole: {
      findMany: jest.fn(),
    },
    roleMenu: {
      findMany: jest.fn(),
    },
    socialClient: {
      findUnique: jest.fn(),
    },
    socialUser: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserCacheService = {
    invalidateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserCacheService, useValue: mockUserCacheService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseUserAgent', () => {
    it('应该解析 Chrome & Windows', () => {
      const res = (service as any).parseUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
      expect(res.browser).toBe('Chrome');
      expect(res.os).toBe('Windows');
    });

    it('应该处理空或未知字符串', () => {
      const res = (service as any).parseUserAgent('');
      expect(res.browser).toBe('Unknown Browser');
      expect(res.os).toBe('Unknown OS');
    });

    it('应该识别 Mac 与 Safari', () => {
      const res = (service as any).parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Safari/605.1.15');
      expect(res.browser).toBe('Safari');
      expect(res.os).toBe('macOS');
    });

    it('应该识别 Firefox, Edge, Opera 以及 Linux, iOS, Android', () => {
      const ffLinux = (service as any).parseUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0');
      expect(ffLinux.browser).toBe('Firefox');
      expect(ffLinux.os).toBe('Linux');

      const edgeiOS = (service as any).parseUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Edg/117.0.0.0');
      expect(edgeiOS.browser).toBe('Edge');
      expect(edgeiOS.os).toBe('iOS');

      const operaAndroid = (service as any).parseUserAgent('Mozilla/5.0 (Linux; Android 13; OPR/76.2.3990.72898)');
      expect(operaAndroid.browser).toBe('Opera');
      expect(operaAndroid.os).toBe('Android');
    });
  });

  describe('login', () => {
    it('用户不存在应抛出 UnauthorizedException', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ username: 'testuser', password: 'password' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockPrismaService.loginLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAIL', message: '用户名不存在' }),
        }),
      );
    });

    it('用户被禁用应抛出 UnauthorizedException', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'disableduser',
        status: 'DISABLE',
      });

      await expect(service.login({ username: 'disableduser', password: 'password' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockPrismaService.loginLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAIL', message: '用户已被禁用' }),
        }),
      );
    });

    it('密码不符应抛出 UnauthorizedException', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        status: 'ENABLE',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ username: 'testuser', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockPrismaService.loginLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAIL', message: '密码错误' }),
        }),
      );
    });

    it('登录成功应该生成 Token 并创建 Session', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
        nickname: 'TestNick',
        status: 'ENABLE',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock_access_token');
      mockPrismaService.userSession.create.mockResolvedValue({});
      mockPrismaService.loginLog.create.mockResolvedValue({});

      const res = await service.login(
        { username: 'testuser', password: 'password' },
        '192.168.1.1',
        'Chrome user agent',
      );

      expect(res.accessToken).toBe('mock_access_token');
      expect(res.userId).toBe(1);
      expect(mockPrismaService.userSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            token: 'mock_access_token',
            userId: 1,
            nickname: 'TestNick',
            ip: '192.168.1.1',
          }),
        }),
      );
      expect(mockPrismaService.loginLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'SUCCESS', message: '登录成功' }),
        }),
      );
    });

    it('如果写入登录日志报错，应该安全捕获不影响登录流程并抛出正确异常', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.loginLog.create.mockRejectedValue(new Error('Database error'));

      await expect(service.login({ username: 'testuser', password: 'password' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('应该删除 Session 记录并让缓存失效', async () => {
      mockPrismaService.userSession.findFirst.mockResolvedValue({ userId: 42, token: 'some_token' });
      mockPrismaService.userSession.deleteMany.mockResolvedValue({ count: 1 });

      await service.logout('some_token');

      expect(mockPrismaService.userSession.findFirst).toHaveBeenCalled();
      expect(mockPrismaService.userSession.deleteMany).toHaveBeenCalledWith({
        where: { token: 'some_token' },
      });
      expect(mockUserCacheService.invalidateUser).toHaveBeenCalledWith(42);
    });
  });

  describe('getUserPermissionInfo', () => {
    it('用户不存在应报错', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserPermissionInfo(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('超级管理员应该获取通配符权限 *:*:*', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1, username: 'admin' });
      mockPrismaService.userRole.findMany.mockResolvedValue([
        { role: { code: 'super_admin' }, roleId: 1 },
      ]);

      const res = await service.getUserPermissionInfo(1);
      expect(res.roles).toContain('super_admin');
      expect(res.permissions).toEqual(['*:*:*']);
    });

    it('常规用户应映射拥有的角色和菜单权限', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 2, username: 'user' });
      mockPrismaService.userRole.findMany.mockResolvedValue([
        { role: { code: 'manager' }, roleId: 10 },
      ]);
      mockPrismaService.roleMenu.findMany.mockResolvedValue([
        { menu: { permission: 'system:user:list' } },
        { menu: { permission: 'system:user:create' } },
      ]);

      const res = await service.getUserPermissionInfo(2);
      expect(res.roles).toContain('manager');
      expect(res.permissions).toEqual(['system:user:list', 'system:user:create']);
    });
  });

  describe('getSocialLoginUrl', () => {
    it('应该抛出异常如果不支持社交登录渠道', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue(null);

      await expect(service.getSocialLoginUrl('WECHAT')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('应该返回正确的 GitHub oauth url', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_id_123',
        redirectUri: 'http://localhost/callback',
        status: 'ENABLE',
      });

      const res = await service.getSocialLoginUrl('GITHUB');
      expect(res.url).toContain('https://github.com/login/oauth/authorize');
      expect(res.url).toContain('github_client_id_123');
    });

    it('如果社交登录渠道虽然开启但不是 GITHUB，应该抛出不支持的异常', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'WECHAT',
        clientId: 'wechat_client_id',
        status: 'ENABLE',
      });

      await expect(service.getSocialLoginUrl('WECHAT')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('socialLogin', () => {
    it('应该抛出异常如果渠道不存在或禁用', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue(null);
      await expect(service.socialLogin('GITHUB', 'mock_code')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('模拟 GitHub 登录，应正确处理自动注册与绑定', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_placeholder',
        redirectUri: 'http://callback',
        status: 'ENABLE',
      });
      mockPrismaService.socialUser.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 101,
        username: 'github_mock_github_user_mock_github_user_123',
        nickname: 'GitHub_Mock GitHub User',
      });
      mockPrismaService.socialUser.create.mockResolvedValue({
        userId: 101,
        user: {
          id: 101,
          username: 'github_mock_github_user_mock_github_user_123',
          nickname: 'GitHub_Mock GitHub User',
          status: 'ENABLE',
        },
      });
      mockJwtService.sign.mockReturnValue('mock_github_jwt_token');

      const res = await service.socialLogin('GITHUB', 'mock_code', 'http://callback');
      expect(res.accessToken).toBe('mock_github_jwt_token');
      expect(res.userId).toBe(101);
    });

    it('当社交账户已绑定时，应该直接登录成功', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_placeholder',
        redirectUri: 'http://callback',
        status: 'ENABLE',
      });
      mockPrismaService.socialUser.findUnique.mockResolvedValue({
        userId: 202,
        user: {
          id: 202,
          username: 'existing_github_user',
          nickname: 'Existing Github User',
          status: 'ENABLE',
        },
      });
      mockJwtService.sign.mockReturnValue('existing_jwt_token');

      const res = await service.socialLogin('GITHUB', 'mock_code', 'http://callback');
      expect(res.accessToken).toBe('existing_jwt_token');
      expect(res.userId).toBe(202);
    });

    it('当绑定的用户状态为禁用时，应该报错', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_placeholder',
        redirectUri: 'http://callback',
        status: 'ENABLE',
      });
      mockPrismaService.socialUser.findUnique.mockResolvedValue({
        userId: 202,
        user: {
          id: 202,
          username: 'disabled_github_user',
          nickname: 'Disabled Github User',
          status: 'DISABLE',
        },
      });

      await expect(
        service.socialLogin('GITHUB', 'mock_code', 'http://callback'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('socialBind', () => {
    it('如果绑定渠道不存在或禁用，应该报错', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue(null);
      await expect(service.socialBind(1, 'GITHUB', 'mock_code')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('如果社交账号已经被其他用户绑定，应该报错', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_placeholder',
        status: 'ENABLE',
      });
      mockPrismaService.socialUser.findFirst.mockResolvedValue({
        userId: 999,
        type: 'GITHUB',
        openid: 'mock_github_user_123',
      });

      await expect(service.socialBind(1, 'GITHUB', 'mock_code')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('如果社交账号已绑定在自己账号上，应当返回成功和已绑定提示', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_placeholder',
        status: 'ENABLE',
      });
      mockPrismaService.socialUser.findFirst.mockResolvedValue({
        userId: 1,
        type: 'GITHUB',
        openid: 'mock_github_user_123',
      });

      const res = await service.socialBind(1, 'GITHUB', 'mock_code');
      expect(res.success).toBe(true);
      expect(res.message).toBe('已经绑定该社交账号');
    });

    it('正常未绑定时，应该执行 upsert 成功绑定', async () => {
      mockPrismaService.socialClient.findUnique.mockResolvedValue({
        type: 'GITHUB',
        clientId: 'github_client_placeholder',
        status: 'ENABLE',
      });
      mockPrismaService.socialUser.findFirst.mockResolvedValue(null);
      mockPrismaService.socialUser.upsert = jest.fn().mockResolvedValue({});

      const res = await service.socialBind(1, 'GITHUB', 'mock_code');
      expect(res.success).toBe(true);
      expect(mockPrismaService.socialUser.upsert).toHaveBeenCalled();
    });
  });

  describe('socialUnbind', () => {
    it('如果原本未绑定，应该报错', async () => {
      mockPrismaService.socialUser.findFirst.mockResolvedValue(null);
      await expect(service.socialUnbind(1, 'GITHUB')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('如果已绑定，应该删除绑定记录', async () => {
      mockPrismaService.socialUser.findFirst.mockResolvedValue({
        id: 777,
        userId: 1,
        type: 'GITHUB',
      });
      mockPrismaService.socialUser.delete = jest.fn().mockResolvedValue({});

      const res = await service.socialUnbind(1, 'GITHUB');
      expect(res.success).toBe(true);
      expect(mockPrismaService.socialUser.delete).toHaveBeenCalledWith({
        where: { id: 777 },
      });
    });
  });

  describe('getSocialBindStatus', () => {
    it('应该正确返回绑定的状态', async () => {
      mockPrismaService.socialUser.findMany.mockResolvedValue([]);
      let res = await service.getSocialBindStatus(1);
      expect(res[0].bound).toBe(false);
      expect(res[0].nickname).toBeNull();

      mockPrismaService.socialUser.findMany.mockResolvedValue([
        { type: 'GITHUB', nickname: 'BoundUser', avatar: 'url' },
      ]);
      res = await service.getSocialBindStatus(1);
      expect(res[0].bound).toBe(true);
      expect(res[0].nickname).toBe('BoundUser');
    });
  });
});
