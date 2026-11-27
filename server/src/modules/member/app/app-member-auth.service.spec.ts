import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RedisService } from '../../../shared/redis/redis.service';
import { SmsCodeService } from '../../system/sms/sms-code.service';
import { AppMemberAuthService } from './app-member-auth.service';

jest.mock('bcrypt');

describe('AppMemberAuthService', () => {
  let service: AppMemberAuthService;

  const mockPrisma = {
    memberUser: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('member_jwt_token'),
  };

  const mockRedisService = {
    set: jest.fn().mockResolvedValue(undefined),
    setJson: jest.fn().mockResolvedValue(undefined),
    getAndDelete: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
  };

  const mockSmsCodeService = {
    sendCode: jest.fn().mockResolvedValue({ success: true }),
    verifyCode: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppMemberAuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: SmsCodeService, useValue: mockSmsCodeService },
      ],
    }).compile();

    service = module.get<AppMemberAuthService>(AppMemberAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('smsLogin 对新手机号应自动注册会员并签发带 userType=1 的双令牌', async () => {
    mockSmsCodeService.verifyCode.mockResolvedValueOnce({ success: true });
    mockPrisma.memberUser.findUnique.mockResolvedValueOnce(null);
    mockPrisma.memberUser.create.mockResolvedValueOnce({
      id: 101,
      mobile: '13900139000',
      nickname: '会员_9000',
      status: CommonStatus.ENABLE,
    });

    const res = await service.smsLogin('13900139000', '123456', '127.0.0.1');

    expect(res.userId).toBe(101);
    expect(res.accessToken).toBe('member_jwt_token');
    expect(res.refreshToken).toBeTruthy();
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({ id: 101, userType: 1 }),
    );
    expect(mockRedisService.set).toHaveBeenCalledWith(
      'member:token:member_jwt_token',
      '101',
      expect.any(Number),
    );
  });

  it('login 密码校验通过应签发令牌，被禁用会员应报错', async () => {
    mockPrisma.memberUser.findUnique.mockResolvedValueOnce({
      id: 5,
      mobile: '13800138000',
      nickname: 'M5',
      password: 'hash',
      status: CommonStatus.DISABLE,
    });
    await expect(service.login('13800138000', 'pwd')).rejects.toThrow(
      UnauthorizedException,
    );

    mockPrisma.memberUser.findUnique.mockResolvedValueOnce({
      id: 5,
      mobile: '13800138000',
      nickname: 'M5',
      password: 'hash',
      status: CommonStatus.ENABLE,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    mockPrisma.memberUser.update.mockResolvedValueOnce({});

    const res = await service.login('13800138000', 'pwd');
    expect(res.accessToken).toBe('member_jwt_token');
  });

  it('refreshToken 应消费旧令牌并重新签发，logout 应吊销会话', async () => {
    mockRedisService.getAndDelete.mockResolvedValueOnce(
      JSON.stringify({ memberId: 5, accessToken: 'old_member_jwt' }),
    );
    mockPrisma.memberUser.findUnique.mockResolvedValueOnce({
      id: 5,
      mobile: '13800138000',
      nickname: 'M5',
      status: CommonStatus.ENABLE,
    });

    const refreshed = await service.refreshToken('ref_1');
    expect(refreshed.accessToken).toBe('member_jwt_token');
    expect(mockRedisService.del).toHaveBeenCalledWith('member:token:old_member_jwt');

    mockRedisService.getAndDelete.mockResolvedValueOnce('ref_2');
    await service.logout('cur_jwt');
    expect(mockRedisService.del).toHaveBeenCalledWith('member:token:cur_jwt');
    expect(mockRedisService.del).toHaveBeenCalledWith('member:refresh:ref_2');
  });
});
