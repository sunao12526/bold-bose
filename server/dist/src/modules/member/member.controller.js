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
exports.MemberController = void 0;
const common_1 = require("@nestjs/common");
const member_service_1 = require("./member.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../shared/guards/permissions.guard");
const require_permissions_decorator_1 = require("../../shared/decorators/require-permissions.decorator");
const log_decorator_1 = require("../../shared/decorators/log.decorator");
const client_1 = require("@prisma/client");
let MemberController = class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    async findAll() {
        return this.memberService.findAll();
    }
    async findOne(id) {
        return this.memberService.findOne(id);
    }
    async updateStatus(id, status) {
        return this.memberService.updateStatus(id, status);
    }
    async adjustPoints(id, amount) {
        return this.memberService.adjustPoints(id, amount);
    }
    async adjustBalance(id, amount) {
        return this.memberService.adjustBalance(id, amount);
    }
    async adjustExperience(id, amount) {
        return this.memberService.adjustExperience(id, amount);
    }
    async assignTags(id, tagIds) {
        return this.memberService.assignTags(id, tagIds);
    }
};
exports.MemberController = MemberController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:query'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:update'),
    (0, log_decorator_1.Log)({ module: '会员管理', type: 'UPDATE', description: '修改会员状态' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/adjust-points'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:update'),
    (0, log_decorator_1.Log)({ module: '会员管理', type: 'UPDATE', description: '调整会员积分' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('amount', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "adjustPoints", null);
__decorate([
    (0, common_1.Put)(':id/adjust-balance'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:update'),
    (0, log_decorator_1.Log)({ module: '会员管理', type: 'UPDATE', description: '调整会员余额' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('amount', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "adjustBalance", null);
__decorate([
    (0, common_1.Put)(':id/adjust-experience'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:update'),
    (0, log_decorator_1.Log)({ module: '会员管理', type: 'UPDATE', description: '调整会员成长值' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('amount', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "adjustExperience", null);
__decorate([
    (0, common_1.Put)(':id/assign-tags'),
    (0, require_permissions_decorator_1.RequirePermissions)('member:user:update'),
    (0, log_decorator_1.Log)({ module: '会员管理', type: 'UPDATE', description: '分配会员标签' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('tagIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "assignTags", null);
exports.MemberController = MemberController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('member/user'),
    __metadata("design:paramtypes", [member_service_1.MemberService])
], MemberController);
//# sourceMappingURL=member.controller.js.map