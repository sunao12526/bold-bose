import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RedisService } from '../../../shared/redis/redis.service';
import { SmsCodeService } from '../../system/sms/sms-code.service';

@Injectable()
export class AppMemberAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly smsCodeService: SmsCodeService,
  ) {}

  private parseDurationMs(expr: string | undefined, fallbackMs: number): number {
    if (!expr) return fallbackMs;
    const match = expr.trim().match(/^(\d+)([dhms]?)$/i);
    if (!match) return fallbackMs;
    const val = Number(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'd') return val * 24 * 60 * 60 * 1000;
    if (unit === 'h') return val * 60 * 60 * 1000;
    if (unit === 'm') return val * 60 * 1000;
    return val * 1000;
  }

  private async issueTokens(member: {
    id: number;
    mobile: string;
    nickname: string;
  }) {
    const payload = {
      id: member.id,
      mobile: member.mobile,
      nickname: member.nickname,
      userType: 1,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = crypto.randomBytes(32).toString('hex');

    const accessTtlMs =
      Number(process.env.JWT_EXPIRES_IN_SECONDS || 86400) * 1000;
    const refreshTtlMs = this.parseDurationMs(
      process.env.JWT_REFRESH_EXPIRES_IN,
      7 * 24 * 60 * 60 * 1000,
    );
    const expiresTime = new Date(Date.now() + accessTtlMs).toISOString();

    await this.redisService.set(
      `member:token:${accessToken}`,
      String(member.id),
      accessTtlMs,
    );
    await this.redisService.setJson(
      `member:refresh:${refreshToken}`,
      { memberId: member.id, accessToken },
      refreshTtlMs,
    );
    await this.redisService.set(
      `member:access_refresh:${accessToken}`,
      refreshToken,
      refreshTtlMs,
    );

    return {
      userId: member.id,
      accessToken,
      refreshToken,
      expiresTime,
    };
  }

  async login(mobile: string, password: string, ip = '127.0.0.1') {
    const member = await this.prisma.memberUser.findUnique({
      where: { mobile },
    });
    if (!member) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    if (member.status !== CommonStatus.ENABLE) {
      throw new UnauthorizedException('该会员账号已被禁用');
    }
    if (!member.password) {
      throw new UnauthorizedException('尚未设置登录密码，请使用短信验证码登录');
    }
    const valid = await bcrypt.compare(password, member.password);
    if (!valid) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    await this.prisma.memberUser.update({
      where: { id: member.id },
      data: { lastLoginIp: ip, lastLoginDate: new Date() },
    });

    return this.issueTokens(member);
  }

  async sendSmsCode(mobile: string, scene = 1, ip = '127.0.0.1') {
    return this.smsCodeService.sendCode(mobile, scene, ip);
  }

  async smsLogin(mobile: string, code: string, ip = '127.0.0.1') {
    await this.smsCodeService.verifyCode(mobile, code, 1, ip);

    let member = await this.prisma.memberUser.findUnique({
      where: { mobile },
    });

    if (!member) {
      member = await this.prisma.memberUser.create({
        data: {
          mobile,
          nickname: `会员_${mobile.slice(-4)}`,
          status: CommonStatus.ENABLE,
          lastLoginIp: ip,
          lastLoginDate: new Date(),
        },
      });
    } else {
      if (member.status !== CommonStatus.ENABLE) {
        throw new UnauthorizedException('该会员账号已被禁用');
      }
      member = await this.prisma.memberUser.update({
        where: { id: member.id },
        data: { lastLoginIp: ip, lastLoginDate: new Date() },
      });
    }

    return this.issueTokens(member);
  }

  async refreshToken(refreshToken: string) {
    const raw = await this.redisService.getAndDelete(
      `member:refresh:${refreshToken}`,
    );
    if (!raw) {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
    const parsed = JSON.parse(raw) as {
      memberId: number;
      accessToken?: string;
    };

    if (parsed.accessToken) {
      await this.redisService.del(`member:token:${parsed.accessToken}`);
      await this.redisService.del(`member:access_refresh:${parsed.accessToken}`);
    }

    const member = await this.prisma.memberUser.findUnique({
      where: { id: parsed.memberId },
    });
    if (!member || member.status !== CommonStatus.ENABLE) {
      throw new UnauthorizedException('会员不存在或已被禁用');
    }

    return this.issueTokens(member);
  }

  async logout(token: string) {
    if (!token) return { success: true };
    await this.redisService.del(`member:token:${token}`);
    const refreshToken = await this.redisService.getAndDelete(
      `member:access_refresh:${token}`,
    );
    if (refreshToken) {
      await this.redisService.del(`member:refresh:${refreshToken}`);
    }
    return { success: true };
  }

  async updateMobile(memberId: number, mobile: string, code: string, ip: string) {
    await this.smsCodeService.verifyCode(mobile, code, 3, ip);
    const existing = await this.prisma.memberUser.findFirst({
      where: { mobile, id: { not: memberId } },
    });
    if (existing) {
      throw new BadRequestException('该手机号已被其他会员绑定');
    }
    return this.prisma.memberUser.update({
      where: { id: memberId },
      data: { mobile },
      select: { id: true, nickname: true, mobile: true, avatar: true },
    });
  }

  async updatePassword(
    memberId: number,
    code: string,
    password: string,
    ip: string,
  ) {
    const member = await this.prisma.memberUser.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      throw new UnauthorizedException('会员不存在');
    }
    await this.smsCodeService.verifyCode(member.mobile, code, 4, ip);
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.memberUser.update({
      where: { id: memberId },
      data: { password: hashedPassword },
    });
    return { success: true };
  }
}
