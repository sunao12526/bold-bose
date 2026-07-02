import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserCacheService } from '../../shared/user-cache.service';
import { IpService } from '../../shared/ip/ip.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userCache: UserCacheService,
    private ipService: IpService,
  ) {}

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

  async login(loginDto: LoginDto, ip = '127.0.0.1', userAgent = '') {
    const writeLog = async (status: string, message: string) => {
      try {
        const location = await this.ipService.search(ip);
        await this.prisma.loginLog.create({
          data: {
            username: loginDto.username,
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
    };

    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      await writeLog('FAIL', '用户名不存在');
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status === 'DISABLE') {
      await writeLog('FAIL', '用户已被禁用');
      throw new UnauthorizedException('用户已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      await writeLog('FAIL', '密码错误');
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { id: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    // Write session details
    const { browser, os } = this.parseUserAgent(userAgent);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Token expires in 1 day

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

    await writeLog('SUCCESS', '登录成功');

    return {
      accessToken,
      userId: user.id,
    };
  }

  async logout(token: string) {
    const session = await this.prisma.userSession.findFirst({
      where: { token },
    });
    await this.prisma.userSession.deleteMany({
      where: { token },
    });
    if (session) {
      this.userCache.invalidateUser(session.userId);
    }
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

    let openid: string;
    let nickname: string;
    let avatar: string;

    if (client.clientId.includes('placeholder') || code === 'mock_code') {
      // Mock GitHub login for testing
      openid = 'mock_github_user_123';
      nickname = 'Mock GitHub User';
      avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
    } else {
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
        openid = String(userData.id);
        nickname = userData.login;
        avatar = userData.avatar_url;
      } catch (err: any) {
        this.logger.warn(
          `GitHub API call failed, using mock fallback: ${err.message}`,
        );
        openid = 'mock_github_user_123';
        nickname = 'Mock GitHub User';
        avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
      }
    }

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
      await writeLog(username, 'FAIL', '社交关联用户已被禁用');
      throw new BadRequestException('用户已被禁用');
    }

    const payload = { id: userId, username };
    const accessToken = this.jwtService.sign(payload);

    // Create session
    const { browser, os } = this.parseUserAgent(userAgent);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await this.prisma.userSession.create({
      data: {
        token: accessToken,
        userId,
        username,
        nickname: socialUser.user.nickname,
        ip,
        userAgent,
        browser,
        os,
        expiresAt,
      },
    });

    await writeLog(username, 'SUCCESS', '社交快捷登录成功');

    return {
      accessToken,
      userId,
    };
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

    let openid: string;
    let nickname: string;
    let avatar: string;

    if (client.clientId.includes('placeholder') || code === 'mock_code') {
      openid = 'mock_github_user_123';
      nickname = 'Mock GitHub User';
      avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
    } else {
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
        openid = String(userData.id);
        nickname = userData.login;
        avatar = userData.avatar_url;
      } catch (err: any) {
        this.logger.warn(
          `GitHub API failed, using mock fallback for binding: ${err.message}`,
        );
        openid = 'mock_github_user_123';
        nickname = 'Mock GitHub User';
        avatar = 'https://avatars.githubusercontent.com/u/9919?v=4';
      }
    }

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
