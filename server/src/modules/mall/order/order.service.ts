import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MallOrderStatus } from '@prisma/client';
import { PayOrderService } from '../../pay/pay-order.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private payOrderService: PayOrderService,
  ) {}

  async findAll(status?: MallOrderStatus) {
    return this.prisma.mallOrder.findMany({
      where: status ? { status } : {},
      include: {
        member: { select: { id: true, nickname: true, mobile: true } },
        items: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.mallOrder.findUnique({
      where: { id },
      include: {
        member: true,
        items: true,
        refunds: true,
      },
    });
    if (!order) throw new NotFoundException('订单不存在');
    return order;
  }

  async adjustPrice(id: number, discountPrice: number, payPrice: number) {
    const order = await this.findOne(id);
    if (order.status !== MallOrderStatus.UNPAID) {
      throw new BadRequestException('只有未付款的订单才能进行改价');
    }
    if (payPrice < 0) {
      throw new BadRequestException('实付金额不能小于 0');
    }
    return this.prisma.mallOrder.update({
      where: { id },
      data: {
        discountPrice,
        payPrice,
      },
      include: { items: true },
    });
  }

  async payMock(id: number) {
    const order = await this.findOne(id);
    if (order.status !== MallOrderStatus.UNPAID) {
      throw new BadRequestException('该订单不是待付款状态，无法模拟支付');
    }

    // Route payment creation and execution through PayModule
    const payOrder = await this.payOrderService.createPayOrder({
      appCode: 'mall_app',
      merchantOrderId: order.no,
      subject: `商城订单: ${order.no}`,
      price: order.payPrice,
      merchantNotifyUrl: 'http://localhost:3000/admin-api/mall/order/pay-notify',
    });

    await this.payOrderService.submitPayOrder(payOrder.id, 'mock');

    return this.prisma.mallOrder.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async payNotify(merchantOrderId: string, payOrderId: number, status: string, payTime: Date | string) {
    const order = await this.prisma.mallOrder.findFirst({
      where: { no: merchantOrderId },
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }

    if (order.status !== MallOrderStatus.UNPAID) {
      return order;
    }

    if (status === 'SUCCESS') {
      return this.prisma.mallOrder.update({
        where: { id: order.id },
        data: {
          status: MallOrderStatus.UNDELIVERED,
          payTime: new Date(payTime),
        },
        include: { items: true },
      });
    }
    return order;
  }

  async ship(id: number, logisticsCo: string, logisticsNo: string) {
    const order = await this.findOne(id);
    if (order.status !== MallOrderStatus.UNDELIVERED) {
      throw new BadRequestException('只有待发货的订单才能进行发货');
    }
    if (!logisticsCo || !logisticsNo) {
      throw new BadRequestException('快递公司和物流单号不能为空');
    }
    return this.prisma.mallOrder.update({
      where: { id },
      data: {
        status: MallOrderStatus.DELIVERED,
        deliveryStatus: true,
        logisticsCo,
        logisticsNo,
        deliveryTime: new Date(),
      },
      include: { items: true },
    });
  }

  async cancel(id: number) {
    const order = await this.findOne(id);
    if (order.status !== MallOrderStatus.UNPAID) {
      throw new BadRequestException('只有未支付的订单才能取消');
    }
    return this.prisma.mallOrder.update({
      where: { id },
      data: {
        status: MallOrderStatus.CANCELLED,
      },
      include: { items: true },
    });
  }
}
