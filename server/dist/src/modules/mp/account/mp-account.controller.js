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
exports.MpAccountController = void 0;
const common_1 = require("@nestjs/common");
const mp_account_service_1 = require("./mp-account.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
let MpAccountController = class MpAccountController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(data) { return this.service.create(data); }
    async findAll() { return this.service.findAll(); }
    async findOne(id) { return this.service.findOne(id); }
    async update(id, data) { return this.service.update(id, data); }
    async remove(id) { return this.service.remove(id); }
};
exports.MpAccountController = MpAccountController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mp:account:create'),
    (0, log_decorator_1.Log)({ module: '公众号管理', type: 'CREATE', description: '创建公众号账号' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MpAccountController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mp:account:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MpAccountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mp:account:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MpAccountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mp:account:update'),
    (0, log_decorator_1.Log)({ module: '公众号管理', type: 'UPDATE', description: '修改公众号账号' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MpAccountController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mp:account:delete'),
    (0, log_decorator_1.Log)({ module: '公众号管理', type: 'DELETE', description: '删除公众号账号' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MpAccountController.prototype, "remove", null);
exports.MpAccountController = MpAccountController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('mp/account'),
    __metadata("design:paramtypes", [mp_account_service_1.MpAccountService])
], MpAccountController);
//# sourceMappingURL=mp-account.controller.js.map