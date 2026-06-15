import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotifyService } from './notify.service';
import { PayOrderStatus, PayNotifyType, CommonStatus } from '@prisma/client';

@Injectable()
export class PayOrderService {
  constructor(
    private prisma: PrismaService,
    private notifyService: NotifyService,
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

    // Check if order already exists
    const existing = await this.prisma.payOrder.findUnique({
      where: {
        appId_merchantOrderId: {
          appId: app.id,
          merchantOrderId: data.merchantOrderId,
        },
      },
    });

    if (existing) {
      // If already paid, throw error
      if (existing.status === PayOrderStatus.SUCCESS) {
        throw new BadRequestException('该订单已支付，请勿重复支付');
      }
      // Otherwise, update price and subject, return existing order
      return this.prisma.payOrder.update({
        where: { id: existing.id },
        data: {
          price: data.price,
          subject: data.subject,
          merchantNotifyUrl: data.merchantNotifyUrl,
          expireTime:
            data.expireTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h default
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
  async submitPayOrder(id: number, channelCode: string) {
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

    // If channel is mock, complete immediately
    if (channelCode === 'mock') {
      const updatedOrder = await this.prisma.payOrder.update({
        where: { id },
        data: {
          status: PayOrderStatus.SUCCESS,
          channelCode,
          payTime: new Date(),
        },
      });

      // Trigger callback
      await this.notifyService.createNotifyTask(PayNotifyType.ORDER, id);

      return { status: PayOrderStatus.SUCCESS, order: updatedOrder };
    }

    // For real channel (Alipay / WeChat), update channel code and return mock payload
    const updatedOrder = await this.prisma.payOrder.update({
      where: { id },
      data: {
        channelCode,
      },
    });

    return {
      status: PayOrderStatus.UNPAID,
      order: updatedOrder,
      displayMode: 'url',
      displayInfo: `http://localhost:3000/mock-payment-gateway?id=${id}&channel=${channelCode}`,
    };
  }

  // 3. Administrative Mock Pay trigger
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
        payTime: new Date(),
      },
    });

    // Trigger callback
    await this.notifyService.createNotifyTask(PayNotifyType.ORDER, id);

    return updatedOrder;
  }

  // 4. Find all
  async findAll() {
    return this.prisma.payOrder.findMany({
      include: {
        app: { select: { id: true, name: true, code: true } },
        notifyLogs: { orderBy: { id: 'desc' } },
      },
      orderBy: { id: 'desc' },
    });
  }

  // 5. Find one
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
