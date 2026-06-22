import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(
        'JWT_SECRET environment variable is required but not defined in .env',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: { id: number; username: string }) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('未提供认证凭证');
    }

    const session = await this.prisma.userSession.findUnique({
      where: { token },
    });

    if (!session) {
      throw new UnauthorizedException(
        '您的登录已失效或已被管理员强制下线，请重新登录',
      );
    }

    const now = new Date();
    if (session.expiresAt < now) {
      throw new UnauthorizedException('会话已过期，请重新登录');
    }

    // Throttle last active time update to once per minute
    if (now.getTime() - session.lastActiveTime.getTime() > 60000) {
      this.prisma.userSession
        .update({
          where: { id: session.id },
          data: { lastActiveTime: now },
        })
        .catch((e) => this.logger.error('Failed to update active time:', e));
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.status === 'DISABLE') {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      sessionId: session.id,
    };
  }
}
