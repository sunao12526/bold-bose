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
exports.ArticleController = void 0;
const common_1 = require("@nestjs/common");
const article_service_1 = require("./article.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
const article_query_dto_1 = require("../dto/article-query.dto");
let ArticleController = class ArticleController {
    articleService;
    constructor(articleService) {
        this.articleService = articleService;
    }
    async create(data) {
        return this.articleService.create(data);
    }
    async findAll(query) {
        return this.articleService.findAll(query);
    }
    async findOne(id) {
        return this.articleService.findOne(id);
    }
    async update(id, data) {
        return this.articleService.update(id, data);
    }
    async remove(id) {
        return this.articleService.remove(id);
    }
    async updateStatus(id, status) {
        return this.articleService.updateStatus(id, status);
    }
};
exports.ArticleController = ArticleController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('cms:article:create'),
    (0, log_decorator_1.Log)({ module: 'CMS文章', type: 'CREATE', description: '创建文章' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('cms:article:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_query_dto_1.ArticleQueryDto]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('cms:article:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('cms:article:update'),
    (0, log_decorator_1.Log)({ module: 'CMS文章', type: 'UPDATE', description: '修改文章' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('cms:article:delete'),
    (0, log_decorator_1.Log)({ module: 'CMS文章', type: 'DELETE', description: '删除文章' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, require_permissions_decorator_1.RequirePermissions)('cms:article:update'),
    (0, log_decorator_1.Log)({ module: 'CMS文章', type: 'UPDATE', description: '修改文章状态' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "updateStatus", null);
exports.ArticleController = ArticleController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('cms/article'),
    __metadata("design:paramtypes", [article_service_1.ArticleService])
], ArticleController);
//# sourceMappingURL=article.controller.js.map