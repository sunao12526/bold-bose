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
exports.LevelController = void 0;
const common_1 = require("@nestjs/common");
const level_service_1 = require("./level.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
let LevelController = class LevelController {
    levelService;
    constructor(levelService) {
        this.levelService = levelService;
    }
    async findAll() {
        return this.levelService.findAll();
    }
    async findOne(id) {
        return this.levelService.findOne(id);
    }
    async create(data) {
        return this.levelService.create(data);
    }
    async update(id, data) {
        return this.levelService.update(id, data);
    }
    async remove(id) {
        return this.levelService.remove(id);
    }
};
exports.LevelController = LevelController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('member:level:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LevelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:level:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LevelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('member:level:create'),
    (0, log_decorator_1.Log)({ module: '会员等级', type: 'CREATE', description: '创建会员等级' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LevelController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:level:update'),
    (0, log_decorator_1.Log)({ module: '会员等级', type: 'UPDATE', description: '更新会员等级' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LevelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:level:delete'),
    (0, log_decorator_1.Log)({ module: '会员等级', type: 'DELETE', description: '删除会员等级' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LevelController.prototype, "remove", null);
exports.LevelController = LevelController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('member/level'),
    __metadata("design:paramtypes", [level_service_1.LevelService])
], LevelController);
//# sourceMappingURL=level.controller.js.map