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
exports.CodegenController = void 0;
const common_1 = require("@nestjs/common");
const codegen_service_1 = require("./codegen.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
let CodegenController = class CodegenController {
    codegenService;
    constructor(codegenService) {
        this.codegenService = codegenService;
    }
    async getDbTables() {
        return this.codegenService.getDbTables();
    }
    async importTables(tableNames, author) {
        await this.codegenService.importTables(tableNames, author);
        return { success: true };
    }
    async findAll() {
        return this.codegenService.findAllTables();
    }
    async findOne(id) {
        return this.codegenService.findOneTable(id);
    }
    async update(id, data) {
        return this.codegenService.updateTableMetadata(id, data);
    }
    async remove(id) {
        return this.codegenService.removeTable(id);
    }
    async preview(id) {
        return this.codegenService.generateCodePreview(id);
    }
    async writeCode(id) {
        return this.codegenService.writeCodeToDisk(id);
    }
};
exports.CodegenController = CodegenController;
__decorate([
    (0, common_1.Get)('db-tables'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "getDbTables", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:create'),
    (0, log_decorator_1.Log)({ module: '代码生成', type: 'CREATE', description: '导入数据库表结构' }),
    __param(0, (0, common_1.Body)('tableNames')),
    __param(1, (0, common_1.Body)('author')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "importTables", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:update'),
    (0, log_decorator_1.Log)({ module: '代码生成', type: 'UPDATE', description: '修改生成表配置' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:delete'),
    (0, log_decorator_1.Log)({ module: '代码生成', type: 'DELETE', description: '删除导入表配置' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('preview/:id'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('write/:id'),
    (0, require_permissions_decorator_1.RequirePermissions)('infra:codegen:create'),
    (0, log_decorator_1.Log)({
        module: '代码生成',
        type: 'CREATE',
        description: '同步写入代码到磁盘',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CodegenController.prototype, "writeCode", null);
exports.CodegenController = CodegenController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('infra/codegen'),
    __metadata("design:paramtypes", [codegen_service_1.CodegenService])
], CodegenController);
//# sourceMappingURL=codegen.controller.js.map