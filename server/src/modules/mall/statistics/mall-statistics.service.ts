import { Injectable } from '@nestjs/common';
import { MallRefundStatus } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MallStatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTradeSummary() {
    const [totalOrders, paidAgg, refundAgg, statusGroups] = await Promise.all([
      this.prisma.mallOrder.count(),
      this.prisma.mallOrder.aggregate({
        where: {
          status: { in: ['UNDELIVERED', 'DELIVERED', 'COMPLETED'] },
        },
        _sum: { payPrice: true },
        _count: { id: true },
      }),
      this.prisma.mallOrderRefund.aggregate({
        where: { status: MallRefundStatus.APPROVED },
        _sum: { refundPrice: true },
        _count: { id: true },
      }),
      this.prisma.mallOrder.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    return {
      totalOrderCount: totalOrders,
      paidOrderCount: paidAgg._count.id,
      totalPayPrice: paidAgg._sum.payPrice ?? 0,
      refundOrderCount: refundAgg._count.id,
      totalRefundPrice: refundAgg._sum.refundPrice ?? 0,
      statusCounts: statusGroups.reduce(
        (acc, g) => {
          acc[g.status] = g._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async getMemberSummary() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalMemberCount, todayNewMemberCount, pointAgg] = await Promise.all([
      this.prisma.memberUser.count(),
      this.prisma.memberUser.count({
        where: { createdAt: { gte: todayStart } },
      }),
      this.prisma.memberUser.aggregate({
        _sum: { points: true, balance: true },
      }),
    ]);

    return {
      totalMemberCount,
      todayNewMemberCount,
      totalPoints: pointAgg._sum.points ?? 0,
      totalBalance: pointAgg._sum.balance ?? 0,
    };
  }

  async getProductSummary() {
    const [totalSpuCount, activeSpuCount, topSalesSpus] = await Promise.all([
      this.prisma.mallSpu.count(),
      this.prisma.mallSpu.count({ where: { status: 'ENABLE' } }),
      this.prisma.mallSpu.findMany({
        orderBy: { salesCount: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          salesCount: true,
          minPrice: true,
          totalStock: true,
        },
      }),
    ]);

    return {
      totalSpuCount,
      activeSpuCount,
      topSalesSpus,
    };
  }
}
