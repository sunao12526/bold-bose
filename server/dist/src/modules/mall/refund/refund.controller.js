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
exports.RefundController = void 0;
const common_1 = require("@nestjs/common");
const refund_service_1 = require("./refund.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const public_decorator_1 = require("../../../shared/decorators/public.decorator");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
let RefundController = class RefundController {
    refundService;
    constructor(refundService) {
        this.refundService = refundService;
    }
    async refundNotify(merchantRefundId, refundId, status, refundTime) {
        await this.refundService.refundNotify(merchantRefundId, refundId, status, refundTime);
        return 'success';
    }
    async findAll() {
        return this.refundService.findAll();
    }
    async findOne(id) {
        return this.refundService.findOne(id);
    }
    async approve(id, auditRemark) {
        return this.refundService.approve(id, auditRemark);
    }
    async reject(id, auditRemark) {
        return this.refundService.reject(id, auditRemark);
    }
};
exports.RefundController = RefundController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('notify'),
    __param(0, (0, common_1.Body)('merchantRefundId')),
    __param(1, (0, common_1.Body)('refundId')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Body)('refundTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "refundNotify", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:refund:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:refund:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/approve'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:refund:update'),
    (0, log_decorator_1.Log)({ module: '退款售后', type: 'UPDATE', description: '同意退款申请' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('auditRemark')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':id/reject'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:refund:update'),
    (0, log_decorator_1.Log)({ module: '退款售后', type: 'UPDATE', description: '拒绝退款申请' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('auditRemark')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RefundController.prototype, "reject", null);
exports.RefundController = RefundController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('mall/refund'),
    __metadata("design:paramtypes", [refund_service_1.RefundService])
], RefundController);
//# sourceMappingURL=refund.controller.js.map