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
var SmsCodeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsCodeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const sms_service_1 = require("./sms.service");
let SmsCodeService = SmsCodeService_1 = class SmsCodeService {
    prisma;
    smsService;
    logger = new common_1.Logger(SmsCodeService_1.name);
    constructor(prisma, smsService) {
        this.prisma = prisma;
        this.smsService = smsService;
    }
    async sendCode(mobile, scene, ip) {
        const now = new Date();
        const lastCode = await this.prisma.smsCode.findFirst({
            where: { mobile },
            orderBy: { createdAt: 'desc' },
        });
        if (lastCode && now.getTime() - lastCode.createdAt.getTime() < 60 * 1000) {
            throw new common_1.BadRequestException('发送验证码间隔未满 60 秒');
        }
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayCount = await this.prisma.smsCode.count({
            where: {
                mobile,
                createdAt: { gte: todayStart },
            },
        });
        if (todayCount >= 10) {
            throw new common_1.BadRequestException('该手机号今日发送验证码已达上限');
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiredAt = new Date(now.getTime() + 5 * 60 * 1000);
        const record = await this.prisma.smsCode.create({
            data: {
                mobile,
                code,
                scene,
                todayIndex: todayCount + 1,
                expiredAt,
            },
        });
        try {
            await this.smsService.sendSms('sms_login', mobile, { code });
        }
        catch (err) {
            this.logger.error('Failed to dispatch SMS simulation:', err.stack || err.message || err);
        }
        return { success: true, expiredAt };
    }
    async verifyCode(mobile, code, scene, ip) {
        const now = new Date();
        const record = await this.prisma.smsCode.findFirst({
            where: {
                mobile,
                scene,
                used: false,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!record) {
            throw new common_1.BadRequestException('验证码不存在或已使用');
        }
        if (record.code !== code) {
            throw new common_1.BadRequestException('验证码错误');
        }
        if (record.expiredAt < now) {
            throw new common_1.BadRequestException('验证码已过期');
        }
        await this.prisma.smsCode.update({
            where: { id: record.id },
            data: {
                used: true,
                usedIp: ip,
                usedTime: now,
            },
        });
        return { success: true };
    }
    async findAllCodes(query) {
        const where = {};
        if (query?.mobile) {
            where.mobile = { contains: query.mobile };
        }
        if (query?.used !== undefined) {
            where.used = query.used === 'true' || query.used === true;
        }
        return this.prisma.smsCode.findMany({
            where,
            orderBy: { id: 'desc' },
        });
    }
};
exports.SmsCodeService = SmsCodeService;
exports.SmsCodeService = SmsCodeService = SmsCodeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        sms_service_1.SmsService])
], SmsCodeService);
//# sourceMappingURL=sms-code.service.js.map