import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RefundQueryDto } from './dto/refund-query.dto';
import { paginateQuery } from '../../../shared/pagination';
import { MallRefundStatus, MallOrderStatus } from '@prisma/client';
import { PayRefundService } from '../../pay/pay-refund.service';

@Injectable()
export class RefundService {
  constructor(
    private prisma: PrismaService,
    private payRefundService: PayRefundService,
  ) {}

  async findAll(query: RefundQueryDto) {
    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.memberId) {
      where.memberId = query.memberId;
    }

    return paginateQuery(this.prisma, 'mallOrderRefund', query, {
      where,
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

    // Save audit remark first
    await this.prisma.mallOrderRefund.update({
      where: { id },
      data: { auditRemark },
    });

    // Delegate refund creation and processing to PayModule
    const payRefund = await this.payRefundService.createRefund({
      appCode: 'mall_app',
      merchantOrderId: refund.order.no,
      merchantRefundId: refund.no,
      refundPrice: refund.refundPrice,
      reason: refund.reason,
      merchantNotifyUrl: 'http://localhost:3000/admin-api/mall/refund/notify',
    });

    await this.payRefundService.refundMock(payRefund.id);

    return this.prisma.mallOrderRefund.findUnique({
      where: { id },
      include: { order: true },
    });
  }

  async refundNotify(
    merchantRefundId: string,
    payRefundId: number,
    status: string,
    refundTime: Date | string,
  ) {
    const refund = await this.prisma.mallOrderRefund.findFirst({
      where: { no: merchantRefundId },
      include: { order: true },
    });
    if (!refund) {
      throw new NotFoundException('退款申请不存在');
    }

    if (refund.status !== MallRefundStatus.APPLY) {
      return refund;
    }

    if (status === 'SUCCESS') {
      return this.prisma.$transaction(async (tx) => {
        // 1. Update refund status to APPROVED
        const updatedRefund = await tx.mallOrderRefund.update({
          where: { id: refund.id },
          data: {
            status: MallRefundStatus.APPROVED,
            auditTime: new Date(refundTime),
          },
        });

        // 2. Update order status to CANCELLED and fetch items
        const updatedOrder = await tx.mallOrder.update({
          where: { id: refund.orderId },
          data: {
            status: MallOrderStatus.CANCELLED,
          },
          include: { items: true },
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

        // 4. Roll back stock for each item
        for (const item of updatedOrder.items) {
          await tx.mallSku.update({
            where: { id: item.skuId },
            data: {
              stock: {
                increment: item.count,
              },
            },
          });

          await tx.mallSpu.update({
            where: { id: item.spuId },
            data: {
              totalStock: {
                increment: item.count,
              },
            },
          });
        }

        return updatedRefund;
      });
    }
    return refund;
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
