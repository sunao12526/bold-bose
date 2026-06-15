import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class LoginLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    username: string;
    ip: string;
    userAgent: string;
    status: string;
    message?: string;
  }) {
    return this.prisma.loginLog.create({
      data: {
        username: data.username,
        ip: data.ip,
        userAgent: data.userAgent,
        status: data.status,
        message: data.message || null,
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.username) {
      where.username = { contains: query.username };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.loginLog.findMany({
      where,
      orderBy: { loginTime: 'desc' },
    });
  }
}
