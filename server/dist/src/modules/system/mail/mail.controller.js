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
exports.MailLogController = exports.MailTemplateController = exports.MailAccountController = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
let MailAccountController = class MailAccountController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(data) {
        return this.service.createAccount(data);
    }
    async findAll(query) {
        return this.service.findAllAccounts(query);
    }
    async findOne(id) {
        return this.service.findOneAccount(id);
    }
    async update(id, data) {
        return this.service.updateAccount(id, data);
    }
    async remove(id) {
        return this.service.removeAccount(id);
    }
};
exports.MailAccountController = MailAccountController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:create'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_account',
        type: 'CREATE',
        description: '创建邮件账号',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailAccountController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailAccountController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MailAccountController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:update'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_account',
        type: 'UPDATE',
        description: '修改邮件账号',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MailAccountController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:delete'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_account',
        type: 'DELETE',
        description: '删除邮件账号',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MailAccountController.prototype, "remove", null);
exports.MailAccountController = MailAccountController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/mail/account'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailAccountController);
let MailTemplateController = class MailTemplateController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(data) {
        return this.service.createTemplate(data);
    }
    async findAll(query) {
        return this.service.findAllTemplates(query);
    }
    async findOne(id) {
        return this.service.findOneTemplate(id);
    }
    async update(id, data) {
        return this.service.updateTemplate(id, data);
    }
    async remove(id) {
        return this.service.removeTemplate(id);
    }
    async sendMock(id, body) {
        const template = await this.service.findOneTemplate(id);
        return this.service.sendMail(template.code, body.receiver, body.params || {});
    }
};
exports.MailTemplateController = MailTemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:create'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_template',
        type: 'CREATE',
        description: '创建邮件模板',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MailTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:update'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_template',
        type: 'UPDATE',
        description: '修改邮件模板',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MailTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:delete'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_template',
        type: 'DELETE',
        description: '删除邮件模板',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MailTemplateController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/send-mock'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:create'),
    (0, log_decorator_1.Log)({
        module: 'system_mail_template',
        type: 'CREATE',
        description: '发送测试邮件',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MailTemplateController.prototype, "sendMock", null);
exports.MailTemplateController = MailTemplateController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/mail/template'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailTemplateController);
let MailLogController = class MailLogController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(query) {
        return this.service.findAllLogs(query);
    }
};
exports.MailLogController = MailLogController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:mail:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailLogController.prototype, "findAll", null);
exports.MailLogController = MailLogController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/mail/log'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailLogController);
//# sourceMappingURL=mail.controller.js.map