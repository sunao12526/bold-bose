import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.operationLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeOldLogs(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this.prisma.operationLog.deleteMany({
      where: {
        createdAt: { lt: date },
      },
    });
  }
}
