import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MallRefundStatus, MallOrderStatus } from '@prisma/client';

@Injectable()
export class RefundService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mallOrderRefund.findMany({
      include: {
        order: {
          include: {
            member: { select: { id: true, nickname: true, mobile: true } },
            items: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const refund = await this.prisma.mallOrderRefund.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            member: true,
            items: true,
          },
        },
      },
    });
    if (!refund) throw new NotFoundException('退款申请不存在');
    return refund;
  }

  async approve(id: number, auditRemark?: string) {
    const refund = await this.findOne(id);
    if (refund.status !== MallRefundStatus.APPLY) {
      throw new BadRequestException('只有待处理的退款申请才能审批');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update refund status to APPROVED
      const updatedRefund = await tx.mallOrderRefund.update({
        where: { id },
        data: {
          status: MallRefundStatus.APPROVED,
          auditRemark,
          auditTime: new Date(),
        },
      });

      // 2. Update order status to CANCELLED
      await tx.mallOrder.update({
        where: { id: refund.orderId },
        data: {
          status: MallOrderStatus.CANCELLED,
        },
      });

      // 3. Refund balance to customer user
      await tx.memberUser.update({
        where: { id: refund.memberId },
        data: {
          balance: {
            increment: refund.refundPrice,
          },
        },
      });

      return updatedRefund;
    });
  }

  async reject(id: number, auditRemark: string) {
    if (!auditRemark || auditRemark.trim() === '') {
      throw new BadRequestException('拒绝退款必须填写审核备注/原因');
    }
    const refund = await this.findOne(id);
    if (refund.status !== MallRefundStatus.APPLY) {
      throw new BadRequestException('只有待处理的退款申请才能审批');
    }

    return this.prisma.mallOrderRefund.update({
      where: { id },
      data: {
        status: MallRefundStatus.REJECTED,
        auditRemark,
        auditTime: new Date(),
      },
    });
  }
}
