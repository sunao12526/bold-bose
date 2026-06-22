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
exports.RefundService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const pagination_1 = require("../../../shared/pagination");
const client_1 = require("@prisma/client");
const pay_refund_service_1 = require("../../pay/pay-refund.service");
let RefundService = class RefundService {
    prisma;
    payRefundService;
    constructor(prisma, payRefundService) {
        this.prisma = prisma;
        this.payRefundService = payRefundService;
    }
    async findAll(query) {
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        return (0, pagination_1.paginateQuery)(this.prisma, 'mallOrderRefund', query, {
            where,
            include: {
                order: {
                    include: {
                        member: { select: { id: true, nickname: true, mobile: true } },
                        items: true,
                    },
                },
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const refund = await this.prisma.mallOrderRefund.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        member: true,
                        items: true,
                    },
                },
            },
        });
        if (!refund)
            throw new common_1.NotFoundException('退款申请不存在');
        return refund;
    }
    async approve(id, auditRemark) {
        const refund = await this.findOne(id);
        if (refund.status !== client_1.MallRefundStatus.APPLY) {
            throw new common_1.BadRequestException('只有待处理的退款申请才能审批');
        }
        await this.prisma.mallOrderRefund.update({
            where: { id },
            data: { auditRemark },
        });
        const payRefund = await this.payRefundService.createRefund({
            appCode: 'mall_app',
            merchantOrderId: refund.order.no,
            merchantRefundId: refund.no,
            refundPrice: refund.refundPrice,
            reason: refund.reason,
            merchantNotifyUrl: 'http://localhost:3000/admin-api/mall/refund/notify',
        });
        await this.payRefundService.refundMock(payRefund.id);
        return this.prisma.mallOrderRefund.findUnique({
            where: { id },
            include: { order: true },
        });
    }
    async refundNotify(merchantRefundId, payRefundId, status, refundTime) {
        const refund = await this.prisma.mallOrderRefund.findFirst({
            where: { no: merchantRefundId },
            include: { order: true },
        });
        if (!refund) {
            throw new common_1.NotFoundException('退款申请不存在');
        }
        if (refund.status !== client_1.MallRefundStatus.APPLY) {
            return refund;
        }
        if (status === 'SUCCESS') {
            return this.prisma.$transaction(async (tx) => {
                const updatedRefund = await tx.mallOrderRefund.update({
                    where: { id: refund.id },
                    data: {
                        status: client_1.MallRefundStatus.APPROVED,
                        auditTime: new Date(refundTime),
                    },
                });
                const updatedOrder = await tx.mallOrder.update({
                    where: { id: refund.orderId },
                    data: {
                        status: client_1.MallOrderStatus.CANCELLED,
                    },
                    include: { items: true },
                });
                await tx.memberUser.update({
                    where: { id: refund.memberId },
                    data: {
                        balance: {
                            increment: refund.refundPrice,
                        },
                    },
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
                return updatedRefund;
            });
        }
        return refund;
    }
    async reject(id, auditRemark) {
        if (!auditRemark || auditRemark.trim() === '') {
            throw new common_1.BadRequestException('拒绝退款必须填写审核备注/原因');
        }
        const refund = await this.findOne(id);
        if (refund.status !== client_1.MallRefundStatus.APPLY) {
            throw new common_1.BadRequestException('只有待处理的退款申请才能审批');
        }
        return this.prisma.mallOrderRefund.update({
            where: { id },
            data: {
                status: client_1.MallRefundStatus.REJECTED,
                auditRemark,
                auditTime: new Date(),
            },
        });
    }
};
exports.RefundService = RefundService;
exports.RefundService = RefundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pay_refund_service_1.PayRefundService])
], RefundService);
//# sourceMappingURL=refund.service.js.map