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
exports.PayChannelController = void 0;
const common_1 = require("@nestjs/common");
const channel_service_1 = require("./channel.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
const client_1 = require("@prisma/client");
let PayChannelController = class PayChannelController {
    channelService;
    constructor(channelService) {
        this.channelService = channelService;
    }
    async createOrUpdate(appId, code, config, status, remark) {
        return this.channelService.createOrUpdate({
            appId,
            code,
            config,
            status,
            remark,
        });
    }
    async findByApp(appId) {
        return this.channelService.findByApp(appId);
    }
    async findChannel(appId, code) {
        return this.channelService.findChannel(appId, code);
    }
    async remove(id) {
        return this.channelService.remove(id);
    }
};
exports.PayChannelController = PayChannelController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:update'),
    (0, log_decorator_1.Log)({ module: '支付应用', type: 'UPDATE', description: '配置支付通道' }),
    __param(0, (0, common_1.Body)('appId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('config')),
    __param(3, (0, common_1.Body)('status')),
    __param(4, (0, common_1.Body)('remark')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object, String, String]),
    __metadata("design:returntype", Promise)
], PayChannelController.prototype, "createOrUpdate", null);
__decorate([
    (0, common_1.Get)('app/:appId'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:query'),
    __param(0, (0, common_1.Param)('appId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayChannelController.prototype, "findByApp", null);
__decorate([
    (0, common_1.Get)(':appId/:code'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:query'),
    __param(0, (0, common_1.Param)('appId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PayChannelController.prototype, "findChannel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:update'),
    (0, log_decorator_1.Log)({ module: '支付应用', type: 'DELETE', description: '删除支付通道' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayChannelController.prototype, "remove", null);
exports.PayChannelController = PayChannelController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('pay/channel'),
    __metadata("design:paramtypes", [channel_service_1.PayChannelService])
], PayChannelController);
//# sourceMappingURL=channel.controller.js.map