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
exports.SignInController = void 0;
const common_1 = require("@nestjs/common");
const sign_in_service_1 = require("./sign-in.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
const client_1 = require("@prisma/client");
let SignInController = class SignInController {
    signInService;
    constructor(signInService) {
        this.signInService = signInService;
    }
    async findAllConfigs() {
        return this.signInService.findAllConfigs();
    }
    async updateConfig(day, point, status) {
        return this.signInService.updateConfig(day, point, status);
    }
    async findAllRecords() {
        return this.signInService.findAllRecords();
    }
    async signIn(id) {
        return this.signInService.signIn(id);
    }
};
exports.SignInController = SignInController;
__decorate([
    (0, common_1.Get)('sign-in/config'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:sign-in-config:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "findAllConfigs", null);
__decorate([
    (0, common_1.Put)('sign-in/config/:day'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:sign-in-config:update'),
    (0, log_decorator_1.Log)({ module: '签到规则', type: 'UPDATE', description: '修改签到奖励配置' }),
    __param(0, (0, common_1.Param)('day', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('point', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('sign-in/record'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:sign-in-record:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "findAllRecords", null);
__decorate([
    (0, common_1.Post)('user/:id/sign-in'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:update'),
    (0, log_decorator_1.Log)({ module: '会员管理', type: 'CREATE', description: '模拟会员每日签到' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SignInController.prototype, "signIn", null);
exports.SignInController = SignInController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('member'),
    __metadata("design:paramtypes", [sign_in_service_1.SignInService])
], SignInController);
//# sourceMappingURL=sign-in.controller.js.map