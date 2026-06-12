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
exports.PayRefundService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const notify_service_1 = require("./notify.service");
const client_1 = require("@prisma/client");
let PayRefundService = class PayRefundService {
    prisma;
    notifyService;
    constructor(prisma, notifyService) {
        this.prisma = prisma;
        this.notifyService = notifyService;
    }
    async createRefund(data) {
        const app = await this.prisma.payApp.findUnique({ where: { code: data.appCode } });
        if (!app) {
            throw new common_1.NotFoundException(`支付应用 [${data.appCode}] 不存在`);
        }
        if (app.status !== client_1.CommonStatus.ENABLE) {
            throw new common_1.BadRequestException('支付应用已被禁用');
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
            throw new common_1.NotFoundException(`商户订单 [${data.merchantOrderId}] 不存在`);
        }
        if (order.status !== client_1.PayOrderStatus.SUCCESS) {
            throw new common_1.BadRequestException('原订单未支付，无法发起退款');
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
                status: { in: [client_1.PayRefundStatus.APPLY, client_1.PayRefundStatus.SUCCESS] },
            },
        });
        const totalRefunded = historicalRefunds.reduce((sum, r) => sum + r.refundPrice, 0);
        if (totalRefunded + data.refundPrice > order.price) {
            throw new common_1.BadRequestException('退款金额超出订单实付总金额');
        }
        return this.prisma.payRefund.create({
            data: {
                appId: app.id,
                payOrderId: order.id,
                merchantRefundId: data.merchantRefundId,
                price: order.price,
                refundPrice: data.refundPrice,
                status: client_1.PayRefundStatus.APPLY,
                reason: data.reason,
                merchantNotifyUrl: data.merchantNotifyUrl,
            },
        });
    }
    async refundMock(id) {
        const refund = await this.prisma.payRefund.findUnique({
            where: { id },
            include: { payOrder: true },
        });
        if (!refund) {
            throw new common_1.NotFoundException('退款订单不存在');
        }
        if (refund.status !== client_1.PayRefundStatus.APPLY) {
            throw new common_1.BadRequestException('只有申请状态的退款单才能模拟退款');
        }
        const updatedRefund = await this.prisma.payRefund.update({
            where: { id },
            data: {
                status: client_1.PayRefundStatus.SUCCESS,
                refundTime: new Date(),
            },
        });
        await this.notifyService.createNotifyTask(client_1.PayNotifyType.REFUND, id);
        return updatedRefund;
    }
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
    async findOne(id) {
        const refund = await this.prisma.payRefund.findUnique({
            where: { id },
            include: {
                payOrder: true,
                notifyLogs: { orderBy: { id: 'desc' } },
            },
        });
        if (!refund)
            throw new common_1.NotFoundException('退款订单不存在');
        return refund;
    }
};
exports.PayRefundService = PayRefundService;
exports.PayRefundService = PayRefundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notify_service_1.NotifyService])
], PayRefundService);
//# sourceMappingURL=pay-refund.service.js.map