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
exports.PayOrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const notify_service_1 = require("./notify.service");
const client_1 = require("@prisma/client");
let PayOrderService = class PayOrderService {
    prisma;
    notifyService;
    constructor(prisma, notifyService) {
        this.prisma = prisma;
        this.notifyService = notifyService;
    }
    async createPayOrder(data) {
        const app = await this.prisma.payApp.findUnique({
            where: { code: data.appCode },
        });
        if (!app) {
            throw new common_1.NotFoundException(`支付应用 [${data.appCode}] 不存在`);
        }
        if (app.status !== client_1.CommonStatus.ENABLE) {
            throw new common_1.BadRequestException('支付应用已被禁用');
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
            if (existing.status === client_1.PayOrderStatus.SUCCESS) {
                throw new common_1.BadRequestException('该订单已支付，请勿重复支付');
            }
            return this.prisma.payOrder.update({
                where: { id: existing.id },
                data: {
                    price: data.price,
                    subject: data.subject,
                    merchantNotifyUrl: data.merchantNotifyUrl,
                    expireTime: data.expireTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });
        }
        return this.prisma.payOrder.create({
            data: {
                appId: app.id,
                merchantOrderId: data.merchantOrderId,
                subject: data.subject,
                price: data.price,
                status: client_1.PayOrderStatus.UNPAID,
                merchantNotifyUrl: data.merchantNotifyUrl,
                expireTime: data.expireTime ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
    }
    async submitPayOrder(id, channelCode) {
        const order = await this.prisma.payOrder.findUnique({
            where: { id },
            include: { app: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('支付订单不存在');
        }
        if (order.status === client_1.PayOrderStatus.SUCCESS) {
            return { status: client_1.PayOrderStatus.SUCCESS, order };
        }
        const channel = await this.prisma.payChannel.findUnique({
            where: {
                appId_code: {
                    appId: order.appId,
                    code: channelCode,
                },
            },
        });
        if (!channel || channel.status !== client_1.CommonStatus.ENABLE) {
            throw new common_1.BadRequestException(`支付通道 [${channelCode}] 未启用或不存在`);
        }
        if (channelCode === 'mock') {
            const updatedOrder = await this.prisma.payOrder.update({
                where: { id },
                data: {
                    status: client_1.PayOrderStatus.SUCCESS,
                    channelCode,
                    payTime: new Date(),
                },
            });
            await this.notifyService.createNotifyTask(client_1.PayNotifyType.ORDER, id);
            return { status: client_1.PayOrderStatus.SUCCESS, order: updatedOrder };
        }
        const updatedOrder = await this.prisma.payOrder.update({
            where: { id },
            data: {
                channelCode,
            },
        });
        return {
            status: client_1.PayOrderStatus.UNPAID,
            order: updatedOrder,
            displayMode: 'url',
            displayInfo: `http://localhost:3000/mock-payment-gateway?id=${id}&channel=${channelCode}`,
        };
    }
    async payMock(id) {
        const order = await this.prisma.payOrder.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException('支付订单不存在');
        }
        if (order.status !== client_1.PayOrderStatus.UNPAID) {
            throw new common_1.BadRequestException('只有待支付的订单才能模拟支付');
        }
        const updatedOrder = await this.prisma.payOrder.update({
            where: { id },
            data: {
                status: client_1.PayOrderStatus.SUCCESS,
                channelCode: 'mock',
                payTime: new Date(),
            },
        });
        await this.notifyService.createNotifyTask(client_1.PayNotifyType.ORDER, id);
        return updatedOrder;
    }
    async findAll() {
        return this.prisma.payOrder.findMany({
            include: {
                app: { select: { id: true, name: true, code: true } },
                notifyLogs: { orderBy: { id: 'desc' } },
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const order = await this.prisma.payOrder.findUnique({
            where: { id },
            include: {
                app: true,
                notifyLogs: { orderBy: { id: 'desc' } },
                refunds: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('支付订单不存在');
        return order;
    }
};
exports.PayOrderService = PayOrderService;
exports.PayOrderService = PayOrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notify_service_1.NotifyService])
], PayOrderService);
//# sourceMappingURL=pay-order.service.js.map