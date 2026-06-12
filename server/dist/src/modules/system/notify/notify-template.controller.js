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
exports.NotifyTemplateController = void 0;
const common_1 = require("@nestjs/common");
const notify_service_1 = require("./notify.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
let NotifyTemplateController = class NotifyTemplateController {
    notifyService;
    constructor(notifyService) {
        this.notifyService = notifyService;
    }
    async create(data) {
        return this.notifyService.createTemplate(data);
    }
    async findAll() {
        return this.notifyService.findAllTemplates();
    }
    async findOne(id) {
        return this.notifyService.findOneTemplate(id);
    }
    async update(id, data) {
        return this.notifyService.updateTemplate(id, data);
    }
    async remove(id) {
        return this.notifyService.removeTemplate(id);
    }
    async sendTest(userId, templateCode, variables) {
        return this.notifyService.send(userId, templateCode, variables);
    }
};
exports.NotifyTemplateController = NotifyTemplateController;
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:notify-template:create'),
    (0, log_decorator_1.Log)({ module: '通知模板', type: 'CREATE', description: '创建通知模板' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotifyTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('system:notify-template:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotifyTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:notify-template:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotifyTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:notify-template:update'),
    (0, log_decorator_1.Log)({ module: '通知模板', type: 'UPDATE', description: '修改通知模板' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NotifyTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:notify-template:delete'),
    (0, log_decorator_1.Log)({ module: '通知模板', type: 'DELETE', description: '删除通知模板' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NotifyTemplateController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('send-test'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:notify-template:update'),
    (0, log_decorator_1.Log)({ module: '通知模板', type: 'UPDATE', description: '测试发送通知' }),
    __param(0, (0, common_1.Body)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('templateCode')),
    __param(2, (0, common_1.Body)('variables')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], NotifyTemplateController.prototype, "sendTest", null);
exports.NotifyTemplateController = NotifyTemplateController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('system/notify-template'),
    __metadata("design:paramtypes", [notify_service_1.NotifyService])
], NotifyTemplateController);
//# sourceMappingURL=notify-template.controller.js.map