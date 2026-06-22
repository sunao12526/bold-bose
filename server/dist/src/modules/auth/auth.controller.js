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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const public_decorator_1 = require("../../shared/decorators/public.decorator");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const captcha_service_1 = require("./captcha.service");
const throttler_1 = require("@nestjs/throttler");
let AuthController = AuthController_1 = class AuthController {
    authService;
    captchaService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, captchaService) {
        this.authService = authService;
        this.captchaService = captchaService;
    }
    getCaptcha() {
        return this.captchaService.generate();
    }
    async login(loginDto, req) {
        this.logger.log(`[Login] Received body: username=${loginDto.username}, captchaKey=${loginDto.captchaKey}`);
        if (!loginDto.captchaKey || !loginDto.captchaCode) {
            throw new common_1.UnauthorizedException('请输入验证码');
        }
        const valid = this.captchaService.verify(loginDto.captchaKey, loginDto.captchaCode);
        this.logger.log(`[Login] Captcha verify result: ${valid}`);
        if (!valid) {
            throw new common_1.UnauthorizedException('验证码错误');
        }
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || '';
        return this.authService.login(loginDto, ip, userAgent);
    }
    async logout(req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            await this.authService.logout(token);
        }
        return { success: true };
    }
    async getPermissionInfo(req) {
        return this.authService.getUserPermissionInfo(req.user.id);
    }
    async getSocialLoginUrl(type, redirectUri) {
        return this.authService.getSocialLoginUrl(type, redirectUri);
    }
    async socialLogin(type, code, redirectUri, req) {
        const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || '';
        return this.authService.socialLogin(type, code, redirectUri, ip, userAgent);
    }
    async socialBind(req, type, code, redirectUri) {
        return this.authService.socialBind(req.user.id, type, code, redirectUri);
    }
    async socialUnbind(req, type) {
        return this.authService.socialUnbind(req.user.id, type);
    }
    async getSocialBindStatus(req) {
        return this.authService.getSocialBindStatus(req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('captcha'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getCaptcha", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('get-permission-info'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPermissionInfo", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('social-login-url'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('redirectUri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSocialLoginUrl", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('social-login'),
    __param(0, (0, common_1.Body)('type')),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('redirectUri')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "socialLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('social-bind'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('type')),
    __param(2, (0, common_1.Body)('code')),
    __param(3, (0, common_1.Body)('redirectUri')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "socialBind", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('social-unbind'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "socialUnbind", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('social-bind-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSocialBindStatus", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('system/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        captcha_service_1.CaptchaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map