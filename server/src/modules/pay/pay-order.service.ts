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
import { PayOrderStatus, PayNotifyType, CommonStatus } from '@prisma/client';

@Injectable()
export class PayOrderService {
  constructor(
    private prisma: PrismaService,
    private notifyService: NotifyService,
    @Optional() private walletService?: PayWalletService,
  ) {}

  // 1. Create a payment order (called by MallOrder service or client modules)
  async createPayOrder(data: {
    appCode: string;
    merchantOrderId: string;
    subject: string;
    price: number;
    merchantNotifyUrl: string;
    expireTime?: Date;
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

    const existing = await this.prisma.payOrder.findUnique({
      where: {
        appId_merchantOrderId: {
          appId: app.id,
          merchantOrderId: data.merchantOrderId,
        },
      },
    });

    if (existing) {
      if (existing.status === PayOrderStatus.SUCCESS) {
        throw new BadRequestException('该订单已支付，请勿重复支付');
      }
      return this.prisma.payOrder.update({
        where: { id: existing.id },
        data: {
          price: data.price,
          subject: data.subject,
          merchantNotifyUrl: data.merchantNotifyUrl,
          expireTime:
            data.expireTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }

    return this.prisma.payOrder.create({
      data: {
        appId: app.id,
        merchantOrderId: data.merchantOrderId,
        subject: data.subject,
        price: data.price,
        status: PayOrderStatus.UNPAID,
        merchantNotifyUrl: data.merchantNotifyUrl,
        expireTime:
          data.expireTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  // 2. Submit payment (specify channel to pay)
  async submitPayOrder(
    id: number,
    channelCode: string,
    extra?: { userId?: number; openid?: string; returnUrl?: string },
  ) {
    const order = await this.prisma.payOrder.findUnique({
      where: { id },
      include: { app: true },
    });
    if (!order) {
      throw new NotFoundException('支付订单不存在');
    }

    if (order.status === PayOrderStatus.SUCCESS) {
      return { status: PayOrderStatus.SUCCESS, order };
    }
    if (order.status === PayOrderStatus.CLOSED) {
      throw new BadRequestException('该支付订单已关闭');
    }

    // 钱包余额支付分支
    if (channelCode === 'wallet') {
      if (!this.walletService) {
        throw new BadRequestException('钱包服务未启用');
      }
      if (!extra?.userId) {
        throw new BadRequestException('钱包支付必须指定用户编号 (userId)');
      }
      const wallet = await this.walletService.getOrCreateWallet(extra.userId, 1);
      await this.walletService.reduceBalance(
        wallet.id,
        order.price,
        WalletBizType.PAYMENT,
        String(order.id),
        `支付订单: ${order.subject}`,
      );

      const updatedOrder = await this.prisma.payOrder.update({
        where: { id },
        data: {
          status: PayOrderStatus.SUCCESS,
          channelCode: 'wallet',
          channelOrderNo: `WALLET_${wallet.id}_${order.id}`,
          channelUserId: String(extra.userId),
          payTime: new Date(),
        },
      });

      await this.notifyService.createNotifyTask(PayNotifyType.ORDER, id);
      return {
        status: PayOrderStatus.SUCCESS,
        order: updatedOrder,
        displayMode: 'none',
        displayInfo: '',
      };
    }

    // Verify channel is configured and enabled
    const channel = await this.prisma.payChannel.findUnique({
      where: {
        appId_code: {
          appId: order.appId,
          code: channelCode,
        },
      },
    });

    if (!channel || channel.status !== CommonStatus.ENABLE) {
      throw new BadRequestException(`支付通道 [${channelCode}] 未启用或不存在`);
    }

    const apiBase =
      process.env.API_BASE_URL || 'http://localhost:3000/admin-api';
    const notifyUrl = `${apiBase}/pay/notify/order/${channel.id}`;

    const client = PayClientFactory.create(channelCode, channel.config);
    const submitRes = await client.submitOrder({
      outTradeNo: `${order.id}`,
      subject: order.subject,
      price: order.price,
      notifyUrl,
      returnUrl: extra?.returnUrl,
      openid: extra?.openid,
      channelCode,
    });

    if (submitRes.status === 'SUCCESS') {
      const updatedOrder = await this.prisma.payOrder.update({
        where: { id },
        data: {
          status: PayOrderStatus.SUCCESS,
          channelCode,
          channelOrderNo: submitRes.channelOrderNo || null,
          payTime: new Date(),
        },
      });

      await this.notifyService.createNotifyTask(PayNotifyType.ORDER, id);
      return {
        status: PayOrderStatus.SUCCESS,
        order: updatedOrder,
        displayMode: submitRes.displayMode,
        displayInfo: submitRes.displayInfo,
      };
    }

    const updatedOrder = await this.prisma.payOrder.update({
      where: { id },
      data: {
        channelCode,
        extensionData: submitRes.raw ?? undefined,
      },
    });

    return {
      status: PayOrderStatus.UNPAID,
      order: updatedOrder,
      displayMode: submitRes.displayMode,
      displayInfo: submitRes.displayInfo,
    };
  }

  // 3. Handle third-party channel payment callback
  async handleChannelNotify(
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
    const parsed = await client.verifyAndParseOrderNotify(headers, body);

    const orderId = Number(parsed.outTradeNo);
    const order = Number.isInteger(orderId)
      ? await this.prisma.payOrder.findUnique({ where: { id: orderId } })
      : await this.prisma.payOrder.findFirst({
          where: { merchantOrderId: parsed.outTradeNo, appId: channel.appId },
        });

    if (!order) {
      throw new NotFoundException(`支付订单 [${parsed.outTradeNo}] 不存在`);
    }

    if (order.status === PayOrderStatus.SUCCESS) {
      return order;
    }

    if (parsed.status === 'SUCCESS') {
      const updated = await this.prisma.payOrder.update({
        where: { id: order.id },
        data: {
          status: PayOrderStatus.SUCCESS,
          channelCode: channel.code,
          channelOrderNo: parsed.channelOrderNo,
          channelUserId: parsed.channelUserId ?? null,
          payTime: parsed.successTime,
        },
      });
      await this.notifyService.createNotifyTask(PayNotifyType.ORDER, order.id);
      return updated;
    }

    if (parsed.status === 'CLOSED') {
      return this.prisma.payOrder.update({
        where: { id: order.id },
        data: { status: PayOrderStatus.CLOSED },
      });
    }

    return order;
  }

  // 4. Administrative Mock Pay trigger
  async payMock(id: number) {
    const order = await this.prisma.payOrder.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('支付订单不存在');
    }

    if (order.status !== PayOrderStatus.UNPAID) {
      throw new BadRequestException('只有待支付的订单才能模拟支付');
    }

    const updatedOrder = await this.prisma.payOrder.update({
      where: { id },
      data: {
        status: PayOrderStatus.SUCCESS,
        channelCode: 'mock',
        channelOrderNo: `MOCK_${id}`,
        payTime: new Date(),
      },
    });

    await this.notifyService.createNotifyTask(PayNotifyType.ORDER, id);
    return updatedOrder;
  }

  // 5. Find all
  async findAll() {
    return this.prisma.payOrder.findMany({
      include: {
        app: { select: { id: true, name: true, code: true } },
        notifyLogs: { orderBy: { id: 'desc' } },
      },
      orderBy: { id: 'desc' },
    });
  }

  // 6. Find one
  async findOne(id: number) {
    const order = await this.prisma.payOrder.findUnique({
      where: { id },
      include: {
        app: true,
        notifyLogs: { orderBy: { id: 'desc' } },
        refunds: true,
      },
    });
    if (!order) throw new NotFoundException('支付订单不存在');
    return order;
  }
}
