import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { UserCacheService } from '../../shared/user-cache.service';
import { IpService } from '../../shared/ip/ip.service';
import { SmsCodeService } from '../system/sms/sms-code.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userCache: UserCacheService,
    private ipService: IpService,
    private redisService: RedisService,
    private smsCodeService: SmsCodeService,
  ) {}

  private parseDurationMs(expr: string | undefined, fallbackMs: number): number {
    if (!expr) return fallbackMs;
    const trimmed = expr.trim();
    const match = trimmed.match(/^(\d+)([dhms]?)$/i);
    if (!match) return fallbackMs;
    const val = Number(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'd') return val * 24 * 60 * 60 * 1000;
    if (unit === 'h') return val * 60 * 60 * 1000;
    if (unit === 'm') return val * 60 * 1000;
    return val * 1000;
  }

  private async writeLoginLog(
    username: string,
    ip: string,
    userAgent: string,
    status: string,
    message: string,
  ) {
    try {
      const location = await this.ipService.search(ip);
      await this.prisma.loginLog.create({
        data: {
          username,
          ip,
          location,
          userAgent,
          status,
          message,
        },
      });
    } catch (err) {
      this.logger.error('Failed to write login log:', err);
    }
  }

  private async issueTokensAndSession(
    user: { id: number; username: string; nickname: string },
    ip = '127.0.0.1',
    userAgent = '',
  ) {
    const payload = { id: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = crypto.randomBytes(32).toString('hex');

    const accessTtlMs =
      Number(process.env.JWT_EXPIRES_IN_SECONDS || 86400) * 1000;
    const refreshTtlMs = this.parseDurationMs(
      process.env.JWT_REFRESH_EXPIRES_IN,
      7 * 24 * 60 * 60 * 1000,
    );
    const expiresAt = new Date(Date.now() + accessTtlMs);
    const { browser, os } = this.parseUserAgent(userAgent);

    await this.prisma.userSession.create({
      data: {
        token: accessToken,
        userId: user.id,
        username: user.username,
        nickname: user.nickname,
        ip,
        userAgent,
        browser,
        os,
        expiresAt,
      },
    });

    await this.redisService.setJson(
      `auth:refresh:${refreshToken}`,
      { userId: user.id, username: user.username, accessToken },
      refreshTtlMs,
    );
    await this.redisService.set(
      `auth:access_refresh:${accessToken}`,
      refreshToken,
      refreshTtlMs,
    );

    return {
      accessToken,
      refreshToken,
      expiresTime: expiresAt.toISOString(),
      userId: user.id,
    };
  }

  private parseUserAgent(userAgentStr: string) {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    if (!userAgentStr) return { browser, os };

    const ua = userAgentStr.toLowerCase();

    if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
    else if (ua.includes('edge') || ua.includes('edg')) browser = 'Edge';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';

    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';

    return { browser, os };
  }

  async login(
    loginDto: Pick<LoginDto, 'username' | 'password'>,
    ip = '127.0.0.1',
    userAgent = '',
  ) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      await this.writeLoginLog(
        loginDto.username,
        ip,
        userAgent,
        'FAIL',
        '用户名不存在',
      );
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status === 'DISABLE') {
      await this.writeLoginLog(
        loginDto.username,
        ip,
        userAgent,
        'FAIL',
        '用户已被禁用',
      );
      throw new UnauthorizedException('用户已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      await this.writeLoginLog(
        loginDto.username,
        ip,
        userAgent,
        'FAIL',
        '密码错误',
      );
      throw new UnauthorizedException('用户名或密码错误');
    }

    const tokens = await this.issueTokensAndSession(user, ip, userAgent);
    await this.writeLoginLog(
      loginDto.username,
      ip,
      userAgent,
      'SUCCESS',
      '登录成功',
    );
    return tokens;
  }

  async logout(token: string) {
    const session = await this.prisma.userSession.findFirst({
      where: { token },
    });
    await this.prisma.userSession.deleteMany({
      where: { token },
    });
    const refreshToken = await this.redisService.getAndDelete(
      `auth:access_refresh:${token}`,
    );
    if (refreshToken) {
      await this.redisService.del(`auth:refresh:${refreshToken}`);
    }
    if (session) {
      this.userCache.invalidateUser(session.userId);
    }
  }

  async refreshToken(
    refreshToken: string,
    ip = '127.0.0.1',
    userAgent = '',
  ) {
    const raw = await this.redisService.getAndDelete(
      `auth:refresh:${refreshToken}`,
    );
    if (!raw) {
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
    const payload = JSON.parse(raw) as {
      userId: number;
      username: string;
      accessToken: string;
    };

    if (payload.accessToken) {
      await this.redisService.del(`auth:access_refresh:${payload.accessToken}`);
      await this.prisma.userSession.deleteMany({
        where: { token: payload.accessToken },
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user || user.status === 'DISABLE') {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    return this.issueTokensAndSession(user, ip, userAgent);
  }

  async sendSmsCode(mobile: string, scene = 1, ip = '127.0.0.1') {
    return this.smsCodeService.sendCode(mobile, scene, ip);
  }

  async smsLogin(
    mobile: string,
    code: string,
    ip = '127.0.0.1',
    userAgent = '',
  ) {
    await this.smsCodeService.verifyCode(mobile, code, 1, ip);

    const user = await this.prisma.user.findFirst({
      where: { mobile },
    });
    if (!user) {
      await this.writeLoginLog(mobile, ip, userAgent, 'FAIL', '手机号未绑定用户');
      throw new UnauthorizedException('该手机号未绑定系统用户');
    }
    if (user.status === 'DISABLE') {
      await this.writeLoginLog(
        user.username,
        ip,
        userAgent,
        'FAIL',
        '用户已被禁用',
      );
      throw new UnauthorizedException('用户已被禁用');
    }

    const tokens = await this.issueTokensAndSession(user, ip, userAgent);
    await this.writeLoginLog(
      user.username,
      ip,
      userAgent,
      'SUCCESS',
      '短信验证码登录成功',
    );
    return tokens;
  }

  async register(
    data: { username: string; password: string; nickname?: string },
    ip = '127.0.0.1',
    userAgent = '',
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing) {
      throw new BadRequestException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        nickname: data.nickname || data.username,
        status: 'ENABLE',
      },
    });

    const tokens = await this.issueTokensAndSession(user, ip, userAgent);
    await this.writeLoginLog(
      user.username,
      ip,
      userAgent,
      'SUCCESS',
      '注册并登录成功',
    );
    return tokens;
  }

  async resetPassword(
    mobile: string,
    code: string,
    password: string,
    ip = '127.0.0.1',
  ) {
    await this.smsCodeService.verifyCode(mobile, code, 4, ip);

    const user = await this.prisma.user.findFirst({
      where: { mobile },
    });
    if (!user) {
      throw new BadRequestException('该手机号未绑定系统用户');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.prisma.userSession.deleteMany({
      where: { userId: user.id },
    });
    await this.userCache.invalidateUser(user.id);

    return { success: true };
  }

  async getUserPermissionInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        mobile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    const roles = userRoles.map((ur) => ur.role.code);

    let permissions: string[] = [];
    if (roles.includes('super_admin')) {
      permissions = ['*:*:*'];
    } else {
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

    return {
      user,
      roles,
      permissions,
    };
  }

  async getSocialLoginUrl(type: string, redirectUri?: string) {
    const client = await this.prisma.socialClient.findUnique({
      where: { type },
    });
    if (!client || client.status === 'DISABLE') {
      throw new BadRequestException('不支持该社交登录渠道');
    }

    const rUri = redirectUri || client.redirectUri;
    if (type === 'GITHUB') {
      return {
        url: `https://github.com/login/oauth/authorize?client_id=${client.clientId}&redirect_uri=${encodeURIComponent(rUri)}&scope=read:user`,
      };
    }
    throw new BadRequestException('目前仅支持 GitHub 社交登录');
  }

  private isSocialMockEnabled(): boolean {
    return (
      process.env.NODE_ENV !== 'production' &&
      process.env.SOCIAL_MOCK_ENABLED === 'true'
    );
  }

  private async fetchGithubProfile(
    client: { clientId: string; clientSecret: string; redirectUri: string },
    code: string,
    redirectUri?: string,
  ): Promise<{ openid: string; nickname: string; avatar: string }> {
    if (
      this.isSocialMockEnabled() &&
      (client.clientId.includes('placeholder') || code === 'mock_code')
    ) {
      return {
        openid: 'mock_github_user_123',
        nickname: 'Mock GitHub User',
        avatar: 'https://avatars.githubusercontent.com/u/9919?v=4',
      };
    }

    try {
      const tokenRes = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: client.clientId,
            client_secret: client.clientSecret,
            code,
            redirect_uri: redirectUri || client.redirectUri,
          }),
        },
      );
      const tokenData: any = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new BadRequestException(
          'GitHub OAuth token exchange failed: ' + JSON.stringify(tokenData),
        );
      }

      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${tokenData.access_token}`,
          'User-Agent': 'bold-bose-server',
        },
      });
      const userData: any = await userRes.json();
      if (!userData.id) {
        throw new BadRequestException('GitHub fetch user profile failed');
      }
      return {
        openid: String(userData.id),
        nickname: userData.login,
        avatar: userData.avatar_url,
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      this.logger.error(`GitHub OAuth API call failed: ${err.message}`);
      throw new BadRequestException('GitHub 社交认证失败，请重试');
    }
  }

  async socialLogin(
    type: string,
    code: string,
    redirectUri?: string,
    ip = '127.0.0.1',
    userAgent = '',
  ) {
    const client = await this.prisma.socialClient.findUnique({
      where: { type },
    });
    if (!client || client.status === 'DISABLE') {
      throw new BadRequestException('不支持该社交登录渠道');
    }
    if (type !== 'GITHUB') {
      throw new BadRequestException('目前仅支持 GitHub 社交登录');
    }

    const { openid, nickname, avatar } = await this.fetchGithubProfile(
      client,
      code,
      redirectUri,
    );

    // Find binding
    let socialUser = await this.prisma.socialUser.findUnique({
      where: { type_openid: { type, openid } },
      include: { user: true },
    });

    const writeLog = async (
      username: string,
      status: string,
      message: string,
    ) => {
      try {
        const location = await this.ipService.search(ip);
        await this.prisma.loginLog.create({
          data: { username, ip, location, userAgent, status, message },
        });
      } catch (err) {
        this.logger.error('Failed to write login log:', err);
      }
    };

    let userId: number;
    let username: string;

    if (!socialUser) {
      // Auto-register user
      username = `github_${nickname.toLowerCase()}_${openid}`;
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });
      let userRecord: any;
      if (existingUser) {
        userRecord = existingUser;
      } else {
        const hashedPassword = await bcrypt.hash(`github_${openid}`, 10);
        userRecord = await this.prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            nickname: `GitHub_${nickname}`,
            avatar,
            status: 'ENABLE',
          } as any,
        });
      }

      socialUser = await this.prisma.socialUser.create({
        data: {
          userId: userRecord.id,
          type,
          openid,
          nickname,
          avatar,
        },
        include: { user: true },
      });
      userId = userRecord.id;
    } else {
      userId = socialUser.userId;
      username = socialUser.user.username;
    }

    if (socialUser.user.status === 'DISABLE') {
      await this.writeLoginLog(
        username,
        ip,
        userAgent,
        'FAIL',
        '社交关联用户已被禁用',
      );
      throw new BadRequestException('用户已被禁用');
    }

    const tokens = await this.issueTokensAndSession(
      {
        id: userId,
        username,
        nickname: socialUser.user.nickname,
      },
      ip,
      userAgent,
    );

    await this.writeLoginLog(
      username,
      ip,
      userAgent,
      'SUCCESS',
      '社交快捷登录成功',
    );

    return tokens;
  }

  async socialBind(
    userId: number,
    type: string,
    code: string,
    redirectUri?: string,
  ) {
    const client = await this.prisma.socialClient.findUnique({
      where: { type },
    });
    if (!client || client.status === 'DISABLE') {
      throw new BadRequestException('不支持该社交绑定渠道');
    }
    if (type !== 'GITHUB') {
      throw new BadRequestException('目前仅支持 GitHub 社交绑定');
    }

    const { openid, nickname, avatar } = await this.fetchGithubProfile(
      client,
      code,
      redirectUri,
    );

    // Check if openid is already bound
    const existing = await this.prisma.socialUser.findFirst({
      where: { type, openid },
    });

    if (existing) {
      if (existing.userId === userId) {
        return { success: true, message: '已经绑定该社交账号' };
      }
      throw new BadRequestException('该社交账号已被其他用户绑定');
    }

    // Bind
    await this.prisma.socialUser.upsert({
      where: { type_openid: { type, openid } },
      create: { userId, type, openid, nickname, avatar },
      update: { userId, nickname, avatar },
    });

    return { success: true };
  }

  async socialUnbind(userId: number, type: string) {
    const bind = await this.prisma.socialUser.findFirst({
      where: { userId, type },
    });
    if (!bind) {
      throw new BadRequestException('未绑定该社交账号');
    }
    await this.prisma.socialUser.delete({
      where: { id: bind.id },
    });
    return { success: true };
  }

  async getSocialBindStatus(userId: number) {
    const binds = await this.prisma.socialUser.findMany({
      where: { userId },
    });
    const githubBind = binds.find((b) => b.type === 'GITHUB');
    return [
      {
        type: 'GITHUB',
        bound: !!githubBind,
        nickname: githubBind?.nickname || null,
        avatar: githubBind?.avatar || null,
      },
    ];
  }
}
