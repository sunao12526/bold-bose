import { Test, TestingModule } from '@nestjs/testing';
import { SmsCodeService } from './sms-code.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SmsService } from './sms.service';
import { BadRequestException } from '@nestjs/common';

describe('SmsCodeService', () => {
  let service: SmsCodeService;

  const mockPrismaService = {
    smsCode: {
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockSmsService = {
    sendSms: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsCodeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
      ],
    }).compile();

    service = module.get<SmsCodeService>(SmsCodeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendCode', () => {
    it('应该抛出异常：如果发送验证码间隔未满 60 秒', async () => {
      const mobile = '13800000000';
      const scene = 1;
      const ip = '127.0.0.1';

      // Mock findFirst to return a record created 30s ago
      const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
      mockPrismaService.smsCode.findFirst.mockResolvedValue({
        createdAt: thirtySecondsAgo,
      });

      await expect(service.sendCode(mobile, scene, ip)).rejects.toThrow(
        new BadRequestException('发送验证码间隔未满 60 秒'),
      );
      expect(mockPrismaService.smsCode.findFirst).toHaveBeenCalledWith({
        where: { mobile },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('应该抛出异常：该手机号今日发送验证码已达上限 (10次)', async () => {
      const mobile = '13800000000';
      const scene = 1;
      const ip = '127.0.0.1';

      // Mock findFirst to return null (no recent requests, passes 60s check)
      mockPrismaService.smsCode.findFirst.mockResolvedValue(null);
      // Mock count to return 10
      mockPrismaService.smsCode.count.mockResolvedValue(10);

      await expect(service.sendCode(mobile, scene, ip)).rejects.toThrow(
        new BadRequestException('该手机号今日发送验证码已达上限'),
      );
      expect(mockPrismaService.smsCode.count).toHaveBeenCalled();
    });

    it('应该成功发送验证码：如果符合冷却和今日上限要求', async () => {
      const mobile = '13800000000';
      const scene = 1;
      const ip = '127.0.0.1';

      mockPrismaService.smsCode.findFirst.mockResolvedValue(null);
      mockPrismaService.smsCode.count.mockResolvedValue(2); // Sent 2 OTPs today
      mockPrismaService.smsCode.create.mockResolvedValue({
        id: 123,
        mobile,
        code: '123456',
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      mockSmsService.sendSms.mockResolvedValue({ success: true });

      const result = await service.sendCode(mobile, scene, ip);

      expect(result.success).toBe(true);
      expect(result.expiredAt).toBeInstanceOf(Date);
      expect(mockPrismaService.smsCode.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            mobile,
            scene,
            todayIndex: 3, // 2 + 1
          }),
        }),
      );
      expect(mockSmsService.sendSms).toHaveBeenCalledWith(
        'sms_login',
        mobile,
        expect.objectContaining({ code: expect.any(String) }),
      );
    });
  });

  describe('verifyCode', () => {
    it('应该抛出异常：验证码不存在或已使用', async () => {
      const mobile = '13800000000';
      const code = '123456';
      const scene = 1;
      const ip = '127.0.0.1';

      mockPrismaService.smsCode.findFirst.mockResolvedValue(null);

      await expect(
        service.verifyCode(mobile, code, scene, ip),
      ).rejects.toThrow(new BadRequestException('验证码不存在或已使用'));
    });

    it('应该抛出异常：验证码错误', async () => {
      const mobile = '13800000000';
      const code = '123456';
      const scene = 1;
      const ip = '127.0.0.1';

      mockPrismaService.smsCode.findFirst.mockResolvedValue({
        id: 1,
        code: '654321', // mismatch
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      await expect(
        service.verifyCode(mobile, code, scene, ip),
      ).rejects.toThrow(new BadRequestException('验证码错误'));
    });

    it('应该抛出异常：验证码已过期', async () => {
      const mobile = '13800000000';
      const code = '123456';
      const scene = 1;
      const ip = '127.0.0.1';

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      mockPrismaService.smsCode.findFirst.mockResolvedValue({
        id: 1,
        code: '123456',
        expiredAt: tenMinutesAgo,
      });

      await expect(
        service.verifyCode(mobile, code, scene, ip),
      ).rejects.toThrow(new BadRequestException('验证码已过期'));
    });

    it('应该校验成功并标记为已使用', async () => {
      const mobile = '13800000000';
      const code = '123456';
      const scene = 1;
      const ip = '127.0.0.1';

      const recordId = 99;
      mockPrismaService.smsCode.findFirst.mockResolvedValue({
        id: recordId,
        code: '123456',
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      });
      mockPrismaService.smsCode.update.mockResolvedValue({
        id: recordId,
        used: true,
      });

      const result = await service.verifyCode(mobile, code, scene, ip);

      expect(result.success).toBe(true);
      expect(mockPrismaService.smsCode.update).toHaveBeenCalledWith({
        where: { id: recordId },
        data: expect.objectContaining({
          used: true,
          usedIp: ip,
          usedTime: expect.any(Date),
        }),
      });
    });
  });
});
