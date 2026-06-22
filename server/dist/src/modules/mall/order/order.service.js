"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
const pay_order_service_1 = require("../../pay/pay-order.service");
const config_1 = require("@nestjs/config");
let OrderService = class OrderService {
    prisma;
    payOrderService;
    configService;
    constructor(prisma, payOrderService, configService) {
        this.prisma = prisma;
        this.payOrderService = payOrderService;
        this.configService = configService;
    }
    async findAll(status) {
        return this.prisma.mallOrder.findMany({
            where: status ? { status } : {},
            include: {
                member: { select: { id: true, nickname: true, mobile: true } },
                items: true,
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const order = await this.prisma.mallOrder.findUnique({
            where: { id },
            include: {
                member: true,
                items: true,
                refunds: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('订单不存在');
        return order;
    }
    async adjustPrice(id, discountPrice, payPrice) {
        const order = await this.findOne(id);
        if (order.status !== client_1.MallOrderStatus.UNPAID) {
            throw new common_1.BadRequestException('只有未付款的订单才能进行改价');
        }
        if (payPrice < 0) {
            throw new common_1.BadRequestException('实付金额不能小于 0');
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
    async payMock(id) {
        const order = await this.findOne(id);
        if (order.status !== client_1.MallOrderStatus.UNPAID) {
            throw new common_1.BadRequestException('该订单不是待付款状态，无法模拟支付');
        }
        const payOrder = await this.payOrderService.createPayOrder({
            appCode: 'mall_app',
            merchantOrderId: order.no,
            subject: `商城订单: ${order.no}`,
            price: order.payPrice,
            merchantNotifyUrl: `${this.configService.get('API_BASE_URL') || 'http://localhost:3000/admin-api'}/mall/order/pay-notify`,
        });
        await this.payOrderService.submitPayOrder(payOrder.id, 'mock');
        return this.prisma.mallOrder.findUnique({
            where: { id },
            include: { items: true },
        });
    }
    async payNotify(merchantOrderId, payOrderId, status, payTime) {
        const order = await this.prisma.mallOrder.findFirst({
            where: { no: merchantOrderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('订单不存在');
        }
        if (order.status !== client_1.MallOrderStatus.UNPAID) {
            return order;
        }
        if (status === 'SUCCESS') {
            return this.prisma.mallOrder.update({
                where: { id: order.id },
                data: {
                    status: client_1.MallOrderStatus.UNDELIVERED,
                    payTime: new Date(payTime),
                },
                include: { items: true },
            });
        }
        return order;
    }
    async ship(id, logisticsCo, logisticsNo) {
        const order = await this.findOne(id);
        if (order.status !== client_1.MallOrderStatus.UNDELIVERED) {
            throw new common_1.BadRequestException('只有待发货的订单才能进行发货');
        }
        if (!logisticsCo || !logisticsNo) {
            throw new common_1.BadRequestException('快递公司和物流单号不能为空');
        }
        return this.prisma.mallOrder.update({
            where: { id },
            data: {
                status: client_1.MallOrderStatus.DELIVERED,
                deliveryStatus: true,
                logisticsCo,
                logisticsNo,
                deliveryTime: new Date(),
            },
            include: { items: true },
        });
    }
    async cancel(id) {
        const order = await this.findOne(id);
        if (order.status !== client_1.MallOrderStatus.UNPAID) {
            throw new common_1.BadRequestException('只有未支付的订单才能取消');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.mallOrder.update({
                where: { id },
                data: {
                    status: client_1.MallOrderStatus.CANCELLED,
                },
                include: { items: true },
            });
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pay_order_service_1.PayOrderService,
        config_1.ConfigService])
], OrderService);
//# sourceMappingURL=order.service.js.map