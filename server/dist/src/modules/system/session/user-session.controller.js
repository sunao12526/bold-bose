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
exports.UserSessionController = void 0;
const common_1 = require("@nestjs/common");
const user_session_service_1 = require("./user-session.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
let UserSessionController = class UserSessionController {
    userSessionService;
    constructor(userSessionService) {
        this.userSessionService = userSessionService;
    }
    async findAll(username, ip) {
        return this.userSessionService.findAll({ username, ip });
    }
    async kickout(id) {
        await this.userSessionService.kickout(id);
        return { success: true };
    }
};
exports.UserSessionController = UserSessionController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user-session:query'),
    __param(0, (0, common_1.Query)('username')),
    __param(1, (0, common_1.Query)('ip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserSessionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user-session:delete'),
    (0, log_decorator_1.Log)({ module: '在线用户', type: 'DELETE', description: '强退用户会话' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSessionController.prototype, "kickout", null);
exports.UserSessionController = UserSessionController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/user-session'),
    __metadata("design:paramtypes", [user_session_service_1.UserSessionService])
], UserSessionController);
//# sourceMappingURL=user-session.controller.js.map