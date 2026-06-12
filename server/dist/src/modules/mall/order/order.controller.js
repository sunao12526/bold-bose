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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
const client_1 = require("@prisma/client");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async findAll(status) {
        return this.orderService.findAll(status);
    }
    async findOne(id) {
        return this.orderService.findOne(id);
    }
    async adjustPrice(id, discountPrice, payPrice) {
        return this.orderService.adjustPrice(id, discountPrice, payPrice);
    }
    async payMock(id) {
        return this.orderService.payMock(id);
    }
    async ship(id, logisticsCo, logisticsNo) {
        return this.orderService.ship(id, logisticsCo, logisticsNo);
    }
    async cancel(id) {
        return this.orderService.cancel(id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:order:query'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:order:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/adjust-price'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:order:update'),
    (0, log_decorator_1.Log)({ module: '订单管理', type: 'UPDATE', description: '订单改价' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('discountPrice', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('payPrice', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "adjustPrice", null);
__decorate([
    (0, common_1.Put)(':id/pay-mock'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:order:update'),
    (0, log_decorator_1.Log)({ module: '订单管理', type: 'UPDATE', description: '订单模拟支付' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "payMock", null);
__decorate([
    (0, common_1.Put)(':id/ship'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:order:update'),
    (0, log_decorator_1.Log)({ module: '订单管理', type: 'UPDATE', description: '订单发货' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('logisticsCo')),
    __param(2, (0, common_1.Body)('logisticsNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "ship", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:order:update'),
    (0, log_decorator_1.Log)({ module: '订单管理', type: 'UPDATE', description: '取消订单' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancel", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('mall/order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map