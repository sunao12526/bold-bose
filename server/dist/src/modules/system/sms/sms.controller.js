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
exports.SmsLogController = exports.SmsTemplateController = exports.SmsChannelController = void 0;
const common_1 = require("@nestjs/common");
const sms_service_1 = require("./sms.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
const sms_channel_query_dto_1 = require("../dto/sms-channel-query.dto");
const sms_template_query_dto_1 = require("../dto/sms-template-query.dto");
const sms_log_query_dto_1 = require("../dto/sms-log-query.dto");
let SmsChannelController = class SmsChannelController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(data) {
        return this.service.createChannel(data);
    }
    async findAll(query) {
        return this.service.findAllChannels(query);
    }
    async findOne(id) {
        return this.service.findOneChannel(id);
    }
    async update(id, data) {
        return this.service.updateChannel(id, data);
    }
    async remove(id) {
        return this.service.removeChannel(id);
    }
};
exports.SmsChannelController = SmsChannelController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:create'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_channel',
        type: 'CREATE',
        description: '创建短信渠道',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsChannelController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_channel_query_dto_1.SmsChannelQueryDto]),
    __metadata("design:returntype", Promise)
], SmsChannelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsChannelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:update'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_channel',
        type: 'UPDATE',
        description: '修改短信渠道',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SmsChannelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:delete'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_channel',
        type: 'DELETE',
        description: '删除短信渠道',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsChannelController.prototype, "remove", null);
exports.SmsChannelController = SmsChannelController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/sms/channel'),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsChannelController);
let SmsTemplateController = class SmsTemplateController {
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
        return this.service.sendSms(template.code, body.mobile, body.params || {});
    }
};
exports.SmsTemplateController = SmsTemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:create'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_template',
        type: 'CREATE',
        description: '创建短信模板',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_template_query_dto_1.SmsTemplateQueryDto]),
    __metadata("design:returntype", Promise)
], SmsTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:update'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_template',
        type: 'UPDATE',
        description: '修改短信模板',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SmsTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:delete'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_template',
        type: 'DELETE',
        description: '删除短信模板',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsTemplateController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/send-mock'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:create'),
    (0, log_decorator_1.Log)({
        module: 'system_sms_template',
        type: 'CREATE',
        description: '发送测试短信',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SmsTemplateController.prototype, "sendMock", null);
exports.SmsTemplateController = SmsTemplateController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/sms/template'),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsTemplateController);
let SmsLogController = class SmsLogController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(query) {
        return this.service.findAllLogs(query);
    }
};
exports.SmsLogController = SmsLogController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_log_query_dto_1.SmsLogQueryDto]),
    __metadata("design:returntype", Promise)
], SmsLogController.prototype, "findAll", null);
exports.SmsLogController = SmsLogController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/sms/log'),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsLogController);
//# sourceMappingURL=sms.controller.js.map