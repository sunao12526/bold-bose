import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class UserSessionService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { username?: string; ip?: string }) {
    const where: any = {};

    if (query.username) {
      where.username = {
        contains: query.username,
        mode: 'insensitive',
      };
    }

    if (query.ip) {
      where.ip = {
        contains: query.ip,
        mode: 'insensitive',
      };
    }

    // Return online sessions that haven't expired
    return this.prisma.userSession.findMany({
      where: {
        ...where,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastActiveTime: 'desc',
      },
    });
  }

  async kickout(id: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { id },
    });
    
    if (!session) {
      throw new NotFoundException('该在线会话不存在或已过期');
    }

    return this.prisma.userSession.delete({
      where: { id },
    });
  }
}
