import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotifyService } from './notify.service';
import { PayClientFactory } from './client/pay-client.factory';
import { PayWalletService, WalletBizType } from './wallet/pay-wallet.service';
import {
  PayRefundStatus,
  PayOrderStatus,
  PayNotifyType,
  CommonStatus,
} from '@prisma/client';

@Injectable()
export class PayRefundService {
  constructor(
    private prisma: PrismaService,
    private notifyService: NotifyService,
    @Optional() private walletService?: PayWalletService,
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
    const app = await this.prisma.payApp.findUnique({
      where: { code: data.appCode },
    });
    if (!app) {
      throw new NotFoundException(`支付应用 [${data.appCode}] 不存在`);
    }

    if (app.status !== CommonStatus.ENABLE) {
      throw new BadRequestException('支付应用已被禁用');
    }

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

    const historicalRefunds = await this.prisma.payRefund.findMany({
      where: {
        payOrderId: order.id,
        status: { in: [PayRefundStatus.APPLY, PayRefundStatus.SUCCESS] },
      },
    });

    const totalRefunded = historicalRefunds.reduce(
      (sum, r) => sum + r.refundPrice,
      0,
    );
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
        channelCode: order.channelCode,
        status: PayRefundStatus.APPLY,
        reason: data.reason,
        merchantNotifyUrl: data.merchantNotifyUrl,
      },
    });
  }

  // 2. Submit refund to real channel or wallet
  async submitRefund(id: number) {
    const refund = await this.prisma.payRefund.findUnique({
      where: { id },
      include: { payOrder: true },
    });
    if (!refund) {
      throw new NotFoundException('退款订单不存在');
    }
    if (refund.status === PayRefundStatus.SUCCESS) {
      return refund;
    }
    if (refund.status !== PayRefundStatus.APPLY) {
      throw new BadRequestException('当前状态无法发起退款');
    }

    const channelCode = refund.channelCode || refund.payOrder.channelCode || 'mock';

    if (channelCode === 'wallet') {
      if (!this.walletService) {
        throw new BadRequestException('钱包服务未启用');
      }
      const userId = Number(refund.payOrder.channelUserId);
      if (!userId) {
        throw new BadRequestException('无法确定原钱包支付用户，退款失败');
      }
      const wallet = await this.walletService.getOrCreateWallet(userId, 1);
      await this.walletService.addBalance(
        wallet.id,
        refund.refundPrice,
        WalletBizType.PAYMENT_REFUND,
        String(refund.id),
        `订单退款退回钱包: ${refund.reason}`,
      );

      const updated = await this.prisma.payRefund.update({
        where: { id },
        data: {
          status: PayRefundStatus.SUCCESS,
          channelRefundNo: `WALLET_REF_${refund.id}`,
          refundTime: new Date(),
        },
      });
      await this.notifyService.createNotifyTask(PayNotifyType.REFUND, id);
      return updated;
    }

    let channelConfig: any = {};
    let channelId = 0;
    if (channelCode !== 'mock') {
      const channel = await this.prisma.payChannel.findUnique({
        where: {
          appId_code: {
            appId: refund.appId,
            code: channelCode,
          },
        },
      });
      if (!channel || channel.status !== CommonStatus.ENABLE) {
        throw new BadRequestException(`退款通道 [${channelCode}] 未启用或不存在`);
      }
      channelConfig = channel.config;
      channelId = channel.id;
    }

    const apiBase =
      process.env.API_BASE_URL || 'http://localhost:3000/admin-api';
    const client = PayClientFactory.create(channelCode, channelConfig);
    const result = await client.refundOrder({
      outTradeNo: String(refund.payOrderId),
      outRefundNo: String(refund.id),
      totalPrice: refund.price,
      refundPrice: refund.refundPrice,
      reason: refund.reason,
      notifyUrl: channelId ? `${apiBase}/pay/notify/refund/${channelId}` : undefined,
    });

    if (result.status === 'SUCCESS') {
      const updated = await this.prisma.payRefund.update({
        where: { id },
        data: {
          status: PayRefundStatus.SUCCESS,
          channelRefundNo: result.channelRefundNo ?? null,
          refundTime: new Date(),
        },
      });
      await this.notifyService.createNotifyTask(PayNotifyType.REFUND, id);
      return updated;
    }

    if (result.status === 'FAIL') {
      return this.prisma.payRefund.update({
        where: { id },
        data: { status: PayRefundStatus.FAIL },
      });
    }

    return this.prisma.payRefund.update({
      where: { id },
      data: { channelRefundNo: result.channelRefundNo ?? null },
    });
  }

  async handleChannelRefundNotify(
    channelId: number,
    headers: Record<string, any>,
    body: any,
  ) {
    const channel = await this.prisma.payChannel.findUnique({
      where: { id: channelId },
    });
    if (!channel) {
      throw new NotFoundException('支付通道不存在');
    }

    const client = PayClientFactory.create(channel.code, channel.config);
    const parsed = await client.verifyAndParseRefundNotify(headers, body);

    const refundId = Number(parsed.outRefundNo);
    const refund = Number.isInteger(refundId)
      ? await this.prisma.payRefund.findUnique({ where: { id: refundId } })
      : await this.prisma.payRefund.findFirst({
          where: { merchantRefundId: parsed.outRefundNo, appId: channel.appId },
        });
    if (!refund) {
      throw new NotFoundException(`退款订单 [${parsed.outRefundNo}] 不存在`);
    }
    if (refund.status === PayRefundStatus.SUCCESS) {
      return refund;
    }

    if (parsed.status === 'SUCCESS') {
      const updated = await this.prisma.payRefund.update({
        where: { id: refund.id },
        data: {
          status: PayRefundStatus.SUCCESS,
          channelRefundNo: parsed.channelRefundNo,
          refundTime: parsed.successTime,
        },
      });
      await this.notifyService.createNotifyTask(PayNotifyType.REFUND, refund.id);
      return updated;
    }

    return this.prisma.payRefund.update({
      where: { id: refund.id },
      data: { status: PayRefundStatus.FAIL },
    });
  }

  // 3. Administrative Mock Refund trigger
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
        channelRefundNo: `MOCK_REF_${id}`,
        refundTime: new Date(),
      },
    });

    await this.notifyService.createNotifyTask(PayNotifyType.REFUND, id);
    return updatedRefund;
  }

  // 4. Find all
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

  // 5. Find one
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
