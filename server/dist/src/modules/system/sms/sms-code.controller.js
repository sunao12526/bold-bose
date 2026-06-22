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
exports.SmsCodeController = void 0;
const common_1 = require("@nestjs/common");
const sms_code_service_1 = require("./sms-code.service");
const public_decorator_1 = require("../../../shared/decorators/public.decorator");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../../shared/decorators/log.decorator");
const throttler_1 = require("@nestjs/throttler");
const sms_code_query_dto_1 = require("../dto/sms-code-query.dto");
let SmsCodeController = class SmsCodeController {
    smsCodeService;
    constructor(smsCodeService) {
        this.smsCodeService = smsCodeService;
    }
    async sendCode(mobile, scene, req) {
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        return this.smsCodeService.sendCode(mobile, scene, ip);
    }
    async verifyCode(mobile, code, scene, req) {
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        return this.smsCodeService.verifyCode(mobile, code, scene, ip);
    }
    async findAll(query) {
        return this.smsCodeService.findAllCodes(query);
    }
};
exports.SmsCodeController = SmsCodeController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('send-code'),
    (0, log_decorator_1.Log)({ module: '短信管理', type: 'OTHER', description: '发送短信验证码' }),
    __param(0, (0, common_1.Body)('mobile')),
    __param(1, (0, common_1.Body)('scene')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], SmsCodeController.prototype, "sendCode", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('verify-code'),
    (0, log_decorator_1.Log)({ module: '短信管理', type: 'OTHER', description: '验证短信验证码' }),
    __param(0, (0, common_1.Body)('mobile')),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('scene')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], SmsCodeController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Get)('code'),
    (0, require_permissions_decorator_1.RequirePermissions)('system:sms:query'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sms_code_query_dto_1.SmsCodeQueryDto]),
    __metadata("design:returntype", Promise)
], SmsCodeController.prototype, "findAll", null);
exports.SmsCodeController = SmsCodeController = __decorate([
    (0, common_1.Controller)('system/sms'),
    __metadata("design:paramtypes", [sms_code_service_1.SmsCodeService])
], SmsCodeController);
//# sourceMappingURL=sms-code.controller.js.map