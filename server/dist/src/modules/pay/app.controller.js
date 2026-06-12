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
exports.PayAppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
const client_1 = require("@prisma/client");
let PayAppController = class PayAppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async create(name, code, status, remark) {
        return this.appService.create({ name, code, status, remark });
    }
    async findAll() {
        return this.appService.findAll();
    }
    async findOne(id) {
        return this.appService.findOne(id);
    }
    async update(id, name, code, status, remark) {
        return this.appService.update(id, { name, code, status, remark });
    }
    async remove(id) {
        return this.appService.remove(id);
    }
};
exports.PayAppController = PayAppController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:create'),
    (0, log_decorator_1.Log)({ module: '支付应用', type: 'CREATE', description: '创建支付应用' }),
    __param(0, (0, common_1.Body)('name')),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Body)('remark')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PayAppController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayAppController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayAppController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:update'),
    (0, log_decorator_1.Log)({ module: '支付应用', type: 'UPDATE', description: '更新支付应用' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('code')),
    __param(3, (0, common_1.Body)('status')),
    __param(4, (0, common_1.Body)('remark')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PayAppController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('pay:app:delete'),
    (0, log_decorator_1.Log)({ module: '支付应用', type: 'DELETE', description: '删除支付应用' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayAppController.prototype, "remove", null);
exports.PayAppController = PayAppController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('pay/app'),
    __metadata("design:paramtypes", [app_service_1.PayAppService])
], PayAppController);
//# sourceMappingURL=app.controller.js.map