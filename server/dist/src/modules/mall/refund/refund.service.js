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
const client_1 = require("@prisma/client");
let RefundService = class RefundService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.mallOrderRefund.findMany({
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
        return this.prisma.$transaction(async (tx) => {
            const updatedRefund = await tx.mallOrderRefund.update({
                where: { id },
                data: {
                    status: client_1.MallRefundStatus.APPROVED,
                    auditRemark,
                    auditTime: new Date(),
                },
            });
            await tx.mallOrder.update({
                where: { id: refund.orderId },
                data: {
                    status: client_1.MallOrderStatus.CANCELLED,
                },
            });
            await tx.memberUser.update({
                where: { id: refund.memberId },
                data: {
                    balance: {
                        increment: refund.refundPrice,
                    },
                },
            });
            return updatedRefund;
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefundService);
//# sourceMappingURL=refund.service.js.map