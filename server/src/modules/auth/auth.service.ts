import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private parseUserAgent(userAgentStr: string) {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    if (!userAgentStr) return { browser, os };
    
    const ua = userAgentStr.toLowerCase();
    
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
    
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    else if (ua.includes('android')) os = 'Android';
    
    return { browser, os };
  }

  async login(loginDto: LoginDto, ip = '127.0.0.1', userAgent = '') {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (user.status === 'DISABLE') {
      throw new UnauthorizedException('用户已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
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

    return {
      accessToken,
      userId: user.id,
    };
  }

  async logout(token: string) {
    await this.prisma.userSession.deleteMany({
      where: { token },
    });
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
}
