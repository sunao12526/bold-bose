import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommonStatus,
  MallCouponType,
  MallCouponUserStatus,
  MallOrderStatus,
  MallRefundStatus,
} from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';
import { PayOrderService } from '../../pay/pay-order.service';
import {
  calculateDeliveryPrice,
  DeliveryService,
} from '../delivery/delivery.service';

export interface SettlementInput {
  items?: Array<{ skuId: number; count: number }>;
  cartIds?: number[];
  couponId?: number | null;
  deliveryTemplateId?: number | null;
  addressId?: number | null;
}

@Injectable()
export class AppTradeOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deliveryService: DeliveryService,
    private readonly payOrderService: PayOrderService,
  ) {}

  async settlement(memberId: number, input: SettlementInput) {
    let rawItems: Array<{ skuId: number; count: number; cartId?: number }> = [];

    if (input.cartIds && input.cartIds.length > 0) {
      const carts = await this.prisma.mallCart.findMany({
        where: { memberId, id: { in: input.cartIds } },
      });
      if (carts.length === 0) {
        throw new BadRequestException('选中的购物车记录不存在');
      }
      rawItems = carts.map((c) => ({
        skuId: c.skuId,
        count: c.count,
        cartId: c.id,
      }));
    } else if (input.items && input.items.length > 0) {
      rawItems = input.items.map((i) => ({ skuId: i.skuId, count: i.count }));
    } else {
      throw new BadRequestException('请选择需要结算的商品');
    }

    const skuIds = rawItems.map((i) => i.skuId);
    const skus = await this.prisma.mallSku.findMany({
      where: { id: { in: skuIds } },
      include: { spu: true },
    });
    const skuMap = new Map(skus.map((s) => [s.id, s]));

    let totalPrice = 0;
    let totalCount = 0;
    const resolvedItems: Array<{
      skuId: number;
      spuId: number;
      spuName: string;
      picUrl: string;
      properties: any;
      price: number;
      count: number;
      cartId?: number;
    }> = [];

    for (const item of rawItems) {
      const sku = skuMap.get(item.skuId);
      if (!sku || !sku.spu || sku.spu.status !== CommonStatus.ENABLE) {
        throw new BadRequestException(`商品规格 [${item.skuId}] 不存在或已下架`);
      }
      if (sku.stock < item.count) {
        throw new BadRequestException(`商品 [${sku.spu.name}] 库存不足`);
      }
      totalPrice += sku.price * item.count;
      totalCount += item.count;
      resolvedItems.push({
        skuId: sku.id,
        spuId: sku.spuId,
        spuName: sku.spu.name,
        picUrl: sku.picUrl || sku.spu.picUrl,
        properties: sku.properties,
        price: sku.price,
        count: item.count,
        cartId: item.cartId,
      });
    }

    // 优惠券计算
    let couponPrice = 0;
    let validCouponUserId: number | null = null;
    if (input.couponId) {
      const userCoupon = await this.prisma.mallCouponUser.findUnique({
        where: { id: input.couponId },
        include: { coupon: true },
      });
      if (!userCoupon || userCoupon.memberId !== memberId) {
        throw new BadRequestException('优惠券不存在');
      }
      if (userCoupon.status !== MallCouponUserStatus.UNUSED) {
        throw new BadRequestException('该优惠券已使用或已过期');
      }
      const now = new Date();
      if (
        userCoupon.validStartTime > now ||
        userCoupon.validEndTime < now
      ) {
        throw new BadRequestException('该优惠券不在有效期内');
      }
      if (totalPrice < userCoupon.coupon.minPrice) {
        throw new BadRequestException('未达到该优惠券的最低消费门槛');
      }
      if (userCoupon.coupon.type === MallCouponType.CASH) {
        couponPrice = Math.min(totalPrice, userCoupon.coupon.value);
      } else {
        couponPrice = Math.floor(
          (totalPrice * Math.max(0, 100 - userCoupon.coupon.value)) / 100,
        );
      }
      validCouponUserId = userCoupon.id;
    }

    // 运费计算
    const deliveryTemplate = await this.deliveryService.findTemplateById(
      input.deliveryTemplateId ?? undefined,
    );
    const deliveryPrice = calculateDeliveryPrice(
      deliveryTemplate,
      totalCount,
      totalPrice,
    );

    const payPrice = Math.max(0, totalPrice - couponPrice + deliveryPrice);

    return {
      items: resolvedItems,
      totalCount,
      totalPrice,
      couponId: validCouponUserId,
      couponPrice,
      deliveryPrice,
      payPrice,
    };
  }

  async createOrder(
    memberId: number,
    input: SettlementInput & { addressId: number; remark?: string },
  ) {
    const address = await this.prisma.memberAddress.findUnique({
      where: { id: input.addressId },
    });
    if (!address || address.memberId !== memberId) {
      throw new BadRequestException('收货地址不存在或不属于当前会员');
    }

    const calc = await this.settlement(memberId, input);
    const orderNo = `ORD${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      // 1. 原子扣减 SKU & SPU 库存
      for (const item of calc.items) {
        const updatedSku = await tx.mallSku.updateMany({
          where: { id: item.skuId, stock: { gte: item.count } },
          data: { stock: { decrement: item.count } },
        });
        if (updatedSku.count === 0) {
          throw new BadRequestException(`商品 [${item.spuName}] 库存不足`);
        }
        await tx.mallSpu.update({
          where: { id: item.spuId },
          data: { totalStock: { decrement: item.count } },
        });
      }

      // 2. 核销优惠券
      if (calc.couponId) {
        const couponRes = await tx.mallCouponUser.updateMany({
          where: {
            id: calc.couponId,
            memberId,
            status: MallCouponUserStatus.UNUSED,
          },
          data: {
            status: MallCouponUserStatus.USED,
            useTime: new Date(),
          },
        });
        if (couponRes.count === 0) {
          throw new BadRequestException('优惠券已被使用');
        }
      }

      // 3. 创建商城订单与明细
      const created = await tx.mallOrder.create({
        data: {
          no: orderNo,
          memberId,
          status: MallOrderStatus.UNPAID,
          totalPrice: calc.totalPrice,
          discountPrice: calc.couponPrice,
          deliveryPrice: calc.deliveryPrice,
          couponId: calc.couponId,
          couponPrice: calc.couponPrice,
          payPrice: calc.payPrice,
          receiverName: address.name,
          receiverMobile: address.mobile,
          receiverAddress: address.detailAddress,
          userRemark: input.remark ?? null,
          items: {
            create: calc.items.map((item) => ({
              spuId: item.spuId,
              skuId: item.skuId,
              spuName: item.spuName,
              picUrl: item.picUrl,
              properties: item.properties ?? [],
              price: item.price,
              count: item.count,
            })),
          },
        },
        include: { items: true },
      });

      if (calc.couponId) {
        const cu = await tx.mallCouponUser.findUnique({
          where: { id: calc.couponId },
        });
        await tx.mallCouponUser.update({
          where: { id: calc.couponId },
          data: { useOrderId: created.id },
        });
        if (cu) {
          await tx.mallCoupon.update({
            where: { id: cu.couponId },
            data: { useCount: { increment: 1 } },
          });
        }
      }

      // 4. 清理购物车中对应商品
      const cartIds = calc.items
        .map((i) => i.cartId)
        .filter((id): id is number => typeof id === 'number');
      if (cartIds.length > 0) {
        await tx.mallCart.deleteMany({
          where: { memberId, id: { in: cartIds } },
        });
      }

      return created;
    });

    // 5. 联动创建支付订单（若存在启用支付应用）
    let payOrderId: number | null = null;
    try {
      let app = await this.prisma.payApp.findUnique({
        where: { code: 'mall_app' },
      });
      if (!app || app.status !== CommonStatus.ENABLE) {
        app = await this.prisma.payApp.findFirst({
          where: { status: CommonStatus.ENABLE },
          orderBy: { id: 'asc' },
        });
      }
      if (app) {
        const apiBase =
          process.env.API_BASE_URL || 'http://localhost:3000/admin-api';
        const payOrder = await this.payOrderService.createPayOrder({
          appCode: app.code,
          merchantOrderId: order.no,
          subject: `商城订单: ${order.no}`,
          price: order.payPrice,
          merchantNotifyUrl: `${apiBase}/mall/order/pay-notify`,
        });
        payOrderId = payOrder.id;
        await this.prisma.mallOrder.update({
          where: { id: order.id },
          data: { payOrderId },
        });
      }
    } catch {
      // 允许在未配置 PayApp 时先创建待支付订单，后续再补充发起支付
    }

    return {
      ...order,
      payOrderId,
    };
  }

  async findMyOrders(
    memberId: number,
    query?: { page?: string; pageSize?: string; status?: MallOrderStatus },
  ) {
    const where: any = { memberId };
    if (query?.status) where.status = query.status;

    return paginateQuery(this.prisma, 'mallOrder', query || {}, {
      where,
      include: { items: true },
      orderBy: { id: 'desc' },
    });
  }

  async findMyOrderDetail(memberId: number, id: number) {
    const order = await this.prisma.mallOrder.findUnique({
      where: { id },
      include: { items: true, refunds: true },
    });
    if (!order) throw new NotFoundException('订单不存在');
    if (order.memberId !== memberId) {
      throw new ForbiddenException('无权查看他人订单');
    }
    return order;
  }

  async receiveOrder(memberId: number, id: number) {
    const order = await this.findMyOrderDetail(memberId, id);
    if (order.status !== MallOrderStatus.DELIVERED) {
      throw new BadRequestException('只有已发货的订单才能确认收货');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.mallOrder.update({
        where: { id },
        data: {
          status: MallOrderStatus.COMPLETED,
          receiveTime: new Date(),
        },
        include: { items: true },
      });

      for (const item of order.items) {
        await tx.mallSpu.update({
          where: { id: item.spuId },
          data: { salesCount: { increment: item.count } },
        });
      }

      return updated;
    });
  }

  async cancelOrder(memberId: number, id: number) {
    const order = await this.findMyOrderDetail(memberId, id);
    if (order.status !== MallOrderStatus.UNPAID) {
      throw new BadRequestException('只有待支付的订单才能取消');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.mallOrder.update({
        where: { id },
        data: { status: MallOrderStatus.CANCELLED },
        include: { items: true },
      });

      for (const item of order.items) {
        await tx.mallSku.update({
          where: { id: item.skuId },
          data: { stock: { increment: item.count } },
        });
        await tx.mallSpu.update({
          where: { id: item.spuId },
          data: { totalStock: { increment: item.count } },
        });
      }

      if (order.couponId) {
        await tx.mallCouponUser.updateMany({
          where: {
            id: order.couponId,
            memberId,
            status: MallCouponUserStatus.USED,
          },
          data: {
            status: MallCouponUserStatus.UNUSED,
            useOrderId: null,
            useTime: null,
          },
        });
      }

      return updated;
    });
  }

  async createAfterSale(
    memberId: number,
    data: {
      orderId: number;
      refundPrice?: number;
      reason: string;
      userRemark?: string;
    },
  ) {
    const order = await this.findMyOrderDetail(memberId, data.orderId);
    if (
      ![
        MallOrderStatus.UNDELIVERED,
        MallOrderStatus.DELIVERED,
        MallOrderStatus.COMPLETED,
      ].includes(order.status as any)
    ) {
      throw new BadRequestException('当前订单状态不支持申请售后退款');
    }

    const refundPrice = data.refundPrice ?? order.payPrice;
    if (refundPrice <= 0 || refundPrice > order.payPrice) {
      throw new BadRequestException('退款金额不合法');
    }

    const no = `REF${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    return this.prisma.mallOrderRefund.create({
      data: {
        no,
        orderId: order.id,
        memberId,
        refundPrice,
        status: MallRefundStatus.APPLY,
        reason: data.reason,
        userRemark: data.userRemark ?? null,
      },
    });
  }
}
