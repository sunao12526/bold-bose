import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SmsService } from './sms.service';

@Injectable()
export class SmsCodeService {
  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
  ) {}

  async sendCode(mobile: string, scene: number, ip: string) {
    const now = new Date();

    // Cooldown check (60 seconds)
    const lastCode = await this.prisma.smsCode.findFirst({
      where: { mobile },
      orderBy: { createdAt: 'desc' },
    });
    if (lastCode && now.getTime() - lastCode.createdAt.getTime() < 60 * 1000) {
      throw new BadRequestException('发送验证码间隔未满 60 秒');
    }

    // Daily limit check (10 per day)
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayCount = await this.prisma.smsCode.count({
      where: {
        mobile,
        createdAt: { gte: todayStart },
      },
    });
    if (todayCount >= 10) {
      throw new BadRequestException('该手机号今日发送验证码已达上限');
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Create record
    const expiredAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes expiration
    const record = await this.prisma.smsCode.create({
      data: {
        mobile,
        code,
        scene,
        todayIndex: todayCount + 1,
        expiredAt,
      },
    });

    // Simulate sending via SmsService
    try {
      await this.smsService.sendSms('sms_login', mobile, { code });
    } catch (err: any) {
      console.error('Failed to dispatch SMS simulation:', err.message);
    }

    return { success: true, expiredAt };
  }

  async verifyCode(mobile: string, code: string, scene: number, ip: string) {
    const now = new Date();

    const record = await this.prisma.smsCode.findFirst({
      where: {
        mobile,
        scene,
        used: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('验证码不存在或已使用');
    }

    if (record.code !== code) {
      throw new BadRequestException('验证码错误');
    }

    if (record.expiredAt < now) {
      throw new BadRequestException('验证码已过期');
    }

    // Mark as used
    await this.prisma.smsCode.update({
      where: { id: record.id },
      data: {
        used: true,
        usedIp: ip,
        usedTime: now,
      },
    });

    return { success: true };
  }

  async findAllCodes(query?: any) {
    const where: any = {};
    if (query?.mobile) {
      where.mobile = { contains: query.mobile };
    }
    if (query?.used !== undefined) {
      where.used = query.used === 'true' || query.used === true;
    }
    return this.prisma.smsCode.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }
}
