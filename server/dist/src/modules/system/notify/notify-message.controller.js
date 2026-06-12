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
exports.NotifyMessageController = void 0;
const common_1 = require("@nestjs/common");
const notify_service_1 = require("./notify.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
let NotifyMessageController = class NotifyMessageController {
    notifyService;
    constructor(notifyService) {
        this.notifyService = notifyService;
    }
    async getMyInbox(req) {
        return this.notifyService.getMyInbox(req.user.id);
    }
    async markRead(req, id) {
        return this.notifyService.markRead(req.user.id, id);
    }
    async markAllRead(req) {
        return this.notifyService.markAllRead(req.user.id);
    }
};
exports.NotifyMessageController = NotifyMessageController;
__decorate([
    (0, common_1.Get)('my-inbox'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotifyMessageController.prototype, "getMyInbox", null);
__decorate([
    (0, common_1.Put)('mark-read/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], NotifyMessageController.prototype, "markRead", null);
__decorate([
    (0, common_1.Put)('mark-all-read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotifyMessageController.prototype, "markAllRead", null);
exports.NotifyMessageController = NotifyMessageController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('system/notify-message'),
    __metadata("design:paramtypes", [notify_service_1.NotifyService])
], NotifyMessageController);
//# sourceMappingURL=notify-message.controller.js.map