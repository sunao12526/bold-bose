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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const common_1 = require("@nestjs/common");
const promotion_service_1 = require("./promotion.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
const client_1 = require("@prisma/client");
let PromotionController = class PromotionController {
    promotionService;
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async findAll() {
        return this.promotionService.findAll();
    }
    async findAllUserCoupons() {
        return this.promotionService.findAllUserCoupons();
    }
    async findOne(id) {
        return this.promotionService.findOne(id);
    }
    async create(data) {
        return this.promotionService.create(data);
    }
    async updateStatus(id, status) {
        return this.promotionService.updateStatus(id, status);
    }
    async sendCoupon(id, memberIds) {
        return this.promotionService.sendCoupon(id, memberIds);
    }
    async remove(id) {
        return this.promotionService.remove(id);
    }
};
exports.PromotionController = PromotionController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user-list'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "findAllUserCoupons", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:create'),
    (0, log_decorator_1.Log)({ module: '营销管理', type: 'CREATE', description: '创建优惠券模板' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:update'),
    (0, log_decorator_1.Log)({
        module: '营销管理',
        type: 'UPDATE',
        description: '更新优惠券模板状态',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:update'),
    (0, log_decorator_1.Log)({ module: '营销管理', type: 'CREATE', description: '分发优惠券给会员' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('memberIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "sendCoupon", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:coupon:delete'),
    (0, log_decorator_1.Log)({ module: '营销管理', type: 'DELETE', description: '删除优惠券模板' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PromotionController.prototype, "remove", null);
exports.PromotionController = PromotionController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('mall/coupon'),
    __metadata("design:paramtypes", [promotion_service_1.PromotionService])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map