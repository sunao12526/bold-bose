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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
const file_service_1 = require("../infra/file/file.service");
let ProfileController = class ProfileController {
    userService;
    fileService;
    constructor(userService, fileService) {
        this.userService = userService;
        this.fileService = fileService;
    }
    async getProfile(req) {
        return this.userService.getProfile(req.user.id);
    }
    async updateProfile(req, data) {
        return this.userService.updateProfile(req.user.id, data);
    }
    async updatePassword(req, data) {
        return this.userService.updatePassword(req.user.id, data);
    }
    async uploadAvatar(file, req) {
        const fileRecord = await this.fileService.upload(file);
        await this.userService.updateProfile(req.user.id, { nickname: req.user.nickname, avatar: fileRecord.url });
        return { url: fileRecord.url };
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, log_decorator_1.Log)({ module: '个人中心', type: 'UPDATE', description: '修改基本资料' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('update-password'),
    (0, log_decorator_1.Log)({ module: '个人中心', type: 'UPDATE', description: '修改登录密码' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('upload-avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, log_decorator_1.Log)({ module: '个人中心', type: 'UPDATE', description: '上传头像' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "uploadAvatar", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('system/user/profile'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        file_service_1.FileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map