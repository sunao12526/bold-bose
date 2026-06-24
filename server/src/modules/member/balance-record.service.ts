import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class BalanceRecordService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.memberId) {
      where.memberId = Number(query.memberId);
    }
    if (query?.bizType) {
      where.bizType = query.bizType;
    }

    if (query?.page || query?.pageSize) {
      const page = Number(query.page || 1);
      const pageSize = Number(query.pageSize || 20);

      const [items, total] = await Promise.all([
        this.prisma.memberBalanceRecord.findMany({
          where,
          include: {
            member: { select: { id: true, nickname: true, mobile: true } },
          },
          orderBy: { id: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.prisma.memberBalanceRecord.count({ where }),
      ]);
      return { items, total };
    }

    const items = await this.prisma.memberBalanceRecord.findMany({
      where,
      include: {
        member: { select: { id: true, nickname: true, mobile: true } },
      },
      orderBy: { id: 'desc' },
    });
    return { items, total: items.length };
  }
}
