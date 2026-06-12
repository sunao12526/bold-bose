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
exports.PayOrderController = void 0;
const common_1 = require("@nestjs/common");
const pay_order_service_1 = require("./pay-order.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
let PayOrderController = class PayOrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async findAll() {
        return this.orderService.findAll();
    }
    async findOne(id) {
        return this.orderService.findOne(id);
    }
    async submit(id, channelCode) {
        return this.orderService.submitPayOrder(id, channelCode);
    }
    async payMock(id) {
        return this.orderService.payMock(id);
    }
};
exports.PayOrderController = PayOrderController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:order:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayOrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:order:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayOrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:order:update'),
    (0, log_decorator_1.Log)({ module: '支付订单', type: 'UPDATE', description: '提交支付订单' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('channelCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PayOrderController.prototype, "submit", null);
__decorate([
    (0, common_1.Put)(':id/pay-mock'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:order:update'),
    (0, log_decorator_1.Log)({ module: '支付订单', type: 'UPDATE', description: '模拟支付成功' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayOrderController.prototype, "payMock", null);
exports.PayOrderController = PayOrderController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('pay/order'),
    __metadata("design:paramtypes", [pay_order_service_1.PayOrderService])
], PayOrderController);
//# sourceMappingURL=pay-order.controller.js.map