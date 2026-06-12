import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotifyService } from './notify.service';
import { PayRefundStatus, PayOrderStatus, PayNotifyType, CommonStatus } from '@prisma/client';

@Injectable()
export class PayRefundService {
  constructor(
    private prisma: PrismaService,
    private notifyService: NotifyService,
  ) {}

  // 1. Create a refund request (called by MallOrderRefund or client modules)
  async createRefund(data: {
    appCode: string;
    merchantOrderId: string;
    merchantRefundId: string;
    refundPrice: number;
    reason: string;
    merchantNotifyUrl: string;
  }) {
    const app = await this.prisma.payApp.findUnique({ where: { code: data.appCode } });
    if (!app) {
      throw new NotFoundException(`支付应用 [${data.appCode}] 不存在`);
    }

    if (app.status !== CommonStatus.ENABLE) {
      throw new BadRequestException('支付应用已被禁用');
    }

    // Find parent pay order
    const order = await this.prisma.payOrder.findUnique({
      where: {
        appId_merchantOrderId: {
          appId: app.id,
          merchantOrderId: data.merchantOrderId,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`商户订单 [${data.merchantOrderId}] 不存在`);
    }

    if (order.status !== PayOrderStatus.SUCCESS) {
      throw new BadRequestException('原订单未支付，无法发起退款');
    }

    // Check if refund record already exists
    const existing = await this.prisma.payRefund.findUnique({
      where: {
        appId_merchantRefundId: {
          appId: app.id,
          merchantRefundId: data.merchantRefundId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Check refund price limits
    const historicalRefunds = await this.prisma.payRefund.findMany({
      where: {
        payOrderId: order.id,
        status: { in: [PayRefundStatus.APPLY, PayRefundStatus.SUCCESS] },
      },
    });

    const totalRefunded = historicalRefunds.reduce((sum, r) => sum + r.refundPrice, 0);
    if (totalRefunded + data.refundPrice > order.price) {
      throw new BadRequestException('退款金额超出订单实付总金额');
    }

    return this.prisma.payRefund.create({
      data: {
        appId: app.id,
        payOrderId: order.id,
        merchantRefundId: data.merchantRefundId,
        price: order.price,
        refundPrice: data.refundPrice,
        status: PayRefundStatus.APPLY,
        reason: data.reason,
        merchantNotifyUrl: data.merchantNotifyUrl,
      },
    });
  }

  // 2. Administrative Mock Refund trigger
  async refundMock(id: number) {
    const refund = await this.prisma.payRefund.findUnique({
      where: { id },
      include: { payOrder: true },
    });
    if (!refund) {
      throw new NotFoundException('退款订单不存在');
    }

    if (refund.status !== PayRefundStatus.APPLY) {
      throw new BadRequestException('只有申请状态的退款单才能模拟退款');
    }

    const updatedRefund = await this.prisma.payRefund.update({
      where: { id },
      data: {
        status: PayRefundStatus.SUCCESS,
        refundTime: new Date(),
      },
    });

    // Trigger callback
    await this.notifyService.createNotifyTask(PayNotifyType.REFUND, id);

    return updatedRefund;
  }

  // 3. Find all
  async findAll() {
    return this.prisma.payRefund.findMany({
      include: {
        payOrder: {
          select: {
            id: true,
            merchantOrderId: true,
            subject: true,
            channelCode: true,
          },
        },
        notifyLogs: { orderBy: { id: 'desc' } },
      },
      orderBy: { id: 'desc' },
    });
  }

  // 4. Find one
  async findOne(id: number) {
    const refund = await this.prisma.payRefund.findUnique({
      where: { id },
      include: {
        payOrder: true,
        notifyLogs: { orderBy: { id: 'desc' } },
      },
    });
    if (!refund) throw new NotFoundException('退款订单不存在');
    return refund;
  }
}
