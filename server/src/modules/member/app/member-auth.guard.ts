import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../../shared/redis/redis.service';

@Injectable()
export class MemberAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('未提供会员认证凭证');
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException('未提供会员认证凭证');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('会员登录已过期或令牌无效');
    }

    if (!payload || payload.userType !== 1 || !payload.id) {
      throw new UnauthorizedException('无效的会员访问令牌');
    }

    const cachedMemberId = await this.redisService.get(`member:token:${token}`);
    if (!cachedMemberId || Number(cachedMemberId) !== Number(payload.id)) {
      throw new UnauthorizedException('会员会话已失效，请重新登录');
    }

    request.user = {
      id: Number(payload.id),
      mobile: payload.mobile,
      nickname: payload.nickname,
      userType: 1,
    };
    return true;
  }
}
