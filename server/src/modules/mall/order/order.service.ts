import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MallOrderStatus } from '@prisma/client';
import { PayOrderService } from '../../pay/pay-order.service';

import { ConfigService } from '@nestjs/config';
import { OrderQueryDto } from './dto/order-query.dto';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private payOrderService: PayOrderService,
    private configService: ConfigService,
  ) {}

  async findAll(query: OrderQueryDto) {
    const where: any = {};
    if (query.no) {
      where.no = { contains: query.no };
    }
    if (query.status) {
      where.status = query.status;
    }

    return paginateQuery(this.prisma, 'mallOrder', query, {
      where,
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
      merchantNotifyUrl: `${this.configService.get<string>('API_BASE_URL') || 'http://localhost:3000/admin-api'}/mall/order/pay-notify`,
    });

    await this.payOrderService.submitPayOrder(payOrder.id, 'mock');

    return this.prisma.mallOrder.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async payNotify(
    merchantOrderId: string,
    payOrderId: number,
    status: string,
    payTime: Date | string,
  ) {
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
      let givePercent = 1;
      const globalConfig = await this.prisma.memberConfig.findFirst();
      if (globalConfig) {
        givePercent = globalConfig.tradePointGivePercent;
      }

      const payPriceYuan = order.payPrice / 100;
      const pointsToGive = Math.floor(payPriceYuan * givePercent);
      const expToGive = Math.floor(payPriceYuan);

      const updated = await this.prisma.$transaction(async (tx) => {
        const o = await tx.mallOrder.update({
          where: { id: order.id },
          data: {
            status: MallOrderStatus.UNDELIVERED,
            payTime: new Date(payTime),
          },
          include: { items: true },
        });

        const member = await tx.memberUser.findUnique({
          where: { id: order.memberId },
        });

        if (member) {
          if (pointsToGive > 0) {
            const newPoints = member.points + pointsToGive;
            await tx.memberUser.update({
              where: { id: member.id },
              data: { points: newPoints },
            });

            await tx.memberPointRecord.create({
              data: {
                memberId: member.id,
                bizType: 'ORDER_PAY',
                bizId: order.no,
                point: pointsToGive,
                afterPoint: newPoints,
                operatorId: 'system',
                description: `订单消费赠送积分，订单号: ${order.no}`,
              },
            });
          }

          if (expToGive > 0) {
            const newExp = member.experience + expToGive;
            await tx.memberUser.update({
              where: { id: member.id },
              data: { experience: newExp },
            });

            await tx.memberExperienceRecord.create({
              data: {
                memberId: member.id,
                bizType: 'ORDER_PAY',
                bizId: order.no,
                experience: expToGive,
                afterExperience: newExp,
                operatorId: 'system',
                description: `订单消费赠送成长值，订单号: ${order.no}`,
              },
            });
          }
        }

        return o;
      });

      try {
        await this.updateMemberLevel(order.memberId);
      } catch (err) {
        console.error('重新计算会员等级失败', err);
      }

      return updated;
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

    return this.prisma.$transaction(async (tx) => {
      // 1. Update order status to CANCELLED
      const updatedOrder = await tx.mallOrder.update({
        where: { id },
        data: {
          status: MallOrderStatus.CANCELLED,
        },
        include: { items: true },
      });

      // 2. Roll back stock for each item
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

      return updatedOrder;
    });
  }

  private async updateMemberLevel(memberId: number) {
    const member = await this.prisma.memberUser.findUnique({
      where: { id: memberId },
    });
    if (!member) return;

    const levels = await this.prisma.memberLevel.findMany({
      where: { status: 'ENABLE' },
      orderBy: { experience: 'desc' },
    });

    const matchedLevel = levels.find((l) => member.experience >= l.experience);
    const targetLevelId = matchedLevel ? matchedLevel.id : null;

    if (member.levelId !== targetLevelId) {
      const oldLevelId = member.levelId;
      const newLevelId = targetLevelId;

      await this.prisma.$transaction(async (tx) => {
        let oldLevelName: string | null = null;
        if (oldLevelId) {
          const oldLevel = await tx.memberLevel.findUnique({ where: { id: oldLevelId } });
          oldLevelName = oldLevel ? oldLevel.name : null;
        }
        let newLevelName: string | null = null;
        if (newLevelId) {
          const newLevel = await tx.memberLevel.findUnique({ where: { id: newLevelId } });
          newLevelName = newLevel ? newLevel.name : null;
        }

        await tx.memberUser.update({
          where: { id: memberId },
          data: { levelId: newLevelId },
        });

        await tx.memberLevelRecord.create({
          data: {
            memberId,
            oldLevelId,
            newLevelId,
            oldLevelName,
            newLevelName,
            experience: member.experience,
            operatorId: 'system',
            description: `成长值变动自动重新评定等级: ${oldLevelName || '普通会员'} -> ${newLevelName || '普通会员'}`,
          },
        });
      });
    }
  }
}
