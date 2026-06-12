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
exports.PayRefundController = void 0;
const common_1 = require("@nestjs/common");
const pay_refund_service_1 = require("./pay-refund.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
let PayRefundController = class PayRefundController {
    refundService;
    constructor(refundService) {
        this.refundService = refundService;
    }
    async findAll() {
        return this.refundService.findAll();
    }
    async findOne(id) {
        return this.refundService.findOne(id);
    }
    async refundMock(id) {
        return this.refundService.refundMock(id);
    }
};
exports.PayRefundController = PayRefundController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:refund:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayRefundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:refund:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayRefundController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/refund-mock'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:refund:update'),
    (0, log_decorator_1.Log)({ module: '退款订单', type: 'UPDATE', description: '模拟退款成功' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayRefundController.prototype, "refundMock", null);
exports.PayRefundController = PayRefundController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('pay/refund'),
    __metadata("design:paramtypes", [pay_refund_service_1.PayRefundService])
], PayRefundController);
//# sourceMappingURL=pay-refund.controller.js.map