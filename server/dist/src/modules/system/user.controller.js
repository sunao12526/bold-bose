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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async create(data) {
        return this.userService.create(data);
    }
    async findAll(query) {
        return this.userService.findAll(query);
    }
    async findOne(id) {
        return this.userService.findOne(id);
    }
    async update(id, data) {
        return this.userService.update(id, data);
    }
    async remove(id) {
        return this.userService.remove(id);
    }
    async assignRoles(id, roleIds) {
        return this.userService.assignRoles(id, roleIds);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user:create'),
    (0, log_decorator_1.Log)({ module: '用户管理', type: 'CREATE', description: '创建用户' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user:update'),
    (0, log_decorator_1.Log)({ module: '用户管理', type: 'UPDATE', description: '修改用户' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user:delete'),
    (0, log_decorator_1.Log)({ module: '用户管理', type: 'DELETE', description: '删除用户' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/assign-roles'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:user:update'),
    (0, log_decorator_1.Log)({ module: '用户管理', type: 'UPDATE', description: '分配用户角色' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('roleIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "assignRoles", null);
exports.UserController = UserController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map