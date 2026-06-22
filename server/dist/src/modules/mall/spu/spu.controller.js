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
exports.SpuController = void 0;
const common_1 = require("@nestjs/common");
const spu_service_1 = require("./spu.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
const spu_dto_1 = require("./dto/spu.dto");
let SpuController = class SpuController {
    spuService;
    constructor(spuService) {
        this.spuService = spuService;
    }
    async create(data) {
        return this.spuService.create(data);
    }
    async findAll() {
        return this.spuService.findAll();
    }
    async findOne(id) {
        return this.spuService.findOne(id);
    }
    async update(id, data) {
        return this.spuService.update(id, data);
    }
    async remove(id) {
        return this.spuService.remove(id);
    }
};
exports.SpuController = SpuController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:spu:create'),
    (0, log_decorator_1.Log)({ module: '商品管理', type: 'CREATE', description: '创建商品' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [spu_dto_1.CreateSpuDto]),
    __metadata("design:returntype", Promise)
], SpuController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:spu:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpuController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:spu:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpuController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:spu:update'),
    (0, log_decorator_1.Log)({ module: '商品管理', type: 'UPDATE', description: '修改商品' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, spu_dto_1.UpdateSpuDto]),
    __metadata("design:returntype", Promise)
], SpuController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('mall:spu:delete'),
    (0, log_decorator_1.Log)({ module: '商品管理', type: 'DELETE', description: '删除商品' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpuController.prototype, "remove", null);
exports.SpuController = SpuController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('mall/spu'),
    __metadata("design:paramtypes", [spu_service_1.SpuService])
], SpuController);
//# sourceMappingURL=spu.controller.js.map