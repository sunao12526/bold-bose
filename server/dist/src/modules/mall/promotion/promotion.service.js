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
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let PromotionService = class PromotionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { scopeValue, ...rest } = data;
        return this.prisma.mallCoupon.create({
            data: {
                ...rest,
                scopeValue: scopeValue || null,
            },
        });
    }
    async findAll() {
        return this.prisma.mallCoupon.findMany({
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const coupon = await this.prisma.mallCoupon.findUnique({
            where: { id },
        });
        if (!coupon)
            throw new common_1.NotFoundException('优惠券模板不存在');
        return coupon;
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.mallCoupon.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.mallCoupon.delete({
            where: { id },
        });
    }
    async sendCoupon(couponId, memberIds) {
        const coupon = await this.findOne(couponId);
        if (coupon.status !== client_1.CommonStatus.ENABLE) {
            throw new common_1.BadRequestException('该优惠券模板未启用，无法分发');
        }
        if (memberIds.length === 0) {
            throw new common_1.BadRequestException('请选择要分发的会员');
        }
        return this.prisma.$transaction(async (tx) => {
            const results = [];
            for (const memberId of memberIds) {
                const currentCoupon = await tx.mallCoupon.findUnique({
                    where: { id: couponId },
                });
                if (!currentCoupon)
                    throw new common_1.NotFoundException('优惠券模板不存在');
                if (currentCoupon.takeCount >= currentCoupon.totalCount) {
                    throw new common_1.BadRequestException(`优惠券 [${currentCoupon.name}] 库存不足，分发终止`);
                }
                const member = await tx.memberUser.findUnique({
                    where: { id: memberId },
                });
                if (!member)
                    throw new common_1.NotFoundException(`会员(ID: ${memberId})不存在`);
                let validStartTime;
                let validEndTime;
                if (currentCoupon.validityType === client_1.MallCouponValidityType.DATE) {
                    if (!currentCoupon.validStartTime || !currentCoupon.validEndTime) {
                        throw new common_1.BadRequestException('固定时间类型的优惠券必须配置起止日期');
                    }
                    validStartTime = currentCoupon.validStartTime;
                    validEndTime = currentCoupon.validEndTime;
                }
                else {
                    const days = currentCoupon.validDays || 1;
                    validStartTime = new Date();
                    validEndTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                }
                const userCoupon = await tx.mallCouponUser.create({
                    data: {
                        couponId,
                        memberId,
                        status: client_1.MallCouponUserStatus.UNUSED,
                        validStartTime,
                        validEndTime,
                    },
                });
                await tx.mallCoupon.update({
                    where: { id: couponId },
                    data: {
                        takeCount: { increment: 1 },
                    },
                });
                results.push(userCoupon);
            }
            return results;
        });
    }
    async findAllUserCoupons() {
        return this.prisma.mallCouponUser.findMany({
            include: {
                coupon: true,
                member: { select: { id: true, nickname: true, mobile: true } },
            },
            orderBy: { id: 'desc' },
        });
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map