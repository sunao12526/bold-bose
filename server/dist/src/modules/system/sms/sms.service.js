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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let SmsService = SmsService_1 = class SmsService {
    prisma;
    logger = new common_1.Logger(SmsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChannel(data) {
        return this.prisma.smsChannel.create({
            data: {
                code: data.code,
                name: data.name,
                apiKey: data.apiKey,
                apiSecret: data.apiSecret,
                signature: data.signature,
                status: data.status || 'ENABLE',
                remark: data.remark || null,
            },
        });
    }
    async findAllChannels(query) {
        const where = {};
        if (query?.code) {
            where.code = { contains: query.code };
        }
        if (query?.name) {
            where.name = { contains: query.name };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.smsChannel.findMany({
            where,
            orderBy: { id: 'desc' },
        });
    }
    async findOneChannel(id) {
        const record = await this.prisma.smsChannel.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('短信渠道不存在');
        return record;
    }
    async updateChannel(id, data) {
        await this.findOneChannel(id);
        return this.prisma.smsChannel.update({
            where: { id },
            data: {
                code: data.code,
                name: data.name,
                apiKey: data.apiKey,
                apiSecret: data.apiSecret,
                signature: data.signature,
                status: data.status,
                remark: data.remark,
            },
        });
    }
    async removeChannel(id) {
        await this.findOneChannel(id);
        const templates = await this.prisma.smsTemplate.findFirst({
            where: { channelId: id },
        });
        if (templates) {
            throw new Error('该渠道下还有绑定的短信模板，无法删除');
        }
        return this.prisma.smsChannel.delete({ where: { id } });
    }
    async createTemplate(data) {
        await this.findOneChannel(Number(data.channelId));
        return this.prisma.smsTemplate.create({
            data: {
                channelId: Number(data.channelId),
                code: data.code,
                name: data.name,
                content: data.content,
                status: data.status || 'ENABLE',
                remark: data.remark || null,
            },
        });
    }
    async findAllTemplates(query) {
        const where = {};
        if (query?.code) {
            where.code = { contains: query.code };
        }
        if (query?.name) {
            where.name = { contains: query.name };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.smsTemplate.findMany({
            where,
            orderBy: { id: 'desc' },
            include: { channel: true },
        });
    }
    async findOneTemplate(id) {
        const record = await this.prisma.smsTemplate.findUnique({
            where: { id },
            include: { channel: true },
        });
        if (!record)
            throw new common_1.NotFoundException('短信模板不存在');
        return record;
    }
    async updateTemplate(id, data) {
        await this.findOneTemplate(id);
        if (data.channelId !== undefined) {
            await this.findOneChannel(Number(data.channelId));
        }
        return this.prisma.smsTemplate.update({
            where: { id },
            data: {
                channelId: data.channelId !== undefined ? Number(data.channelId) : undefined,
                code: data.code,
                name: data.name,
                content: data.content,
                status: data.status,
                remark: data.remark,
            },
        });
    }
    async removeTemplate(id) {
        await this.findOneTemplate(id);
        return this.prisma.smsTemplate.delete({ where: { id } });
    }
    async findAllLogs(query) {
        const where = {};
        if (query?.mobile) {
            where.mobile = { contains: query.mobile };
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.templateId) {
            where.templateId = Number(query.templateId);
        }
        return this.prisma.smsLog.findMany({
            where,
            orderBy: { sendTime: 'desc' },
            include: {
                template: {
                    include: { channel: true },
                },
            },
        });
    }
    async sendSms(templateCode, mobile, params) {
        const template = await this.prisma.smsTemplate.findUnique({
            where: { code: templateCode },
            include: { channel: true },
        });
        if (!template) {
            throw new Error(`短信模板 code ${templateCode} 不存在`);
        }
        if (template.status === 'DISABLE') {
            throw new Error(`短信模板 code ${templateCode} 已禁用`);
        }
        if (template.channel.status === 'DISABLE') {
            throw new Error(`短信渠道 ${template.channel.name} 已禁用`);
        }
        let content = template.content;
        Object.keys(params).forEach((key) => {
            content = content.replace(new RegExp(`{${key}}`, 'g'), String(params[key]));
        });
        this.logger.log(`[SMS Simulation] Sending SMS to ${mobile} via channel ${template.channel.name}. Content: "${content}"`);
        return this.prisma.smsLog.create({
            data: {
                templateId: template.id,
                mobile,
                content,
                status: 'SUCCESS',
                errorMessage: null,
            },
        });
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SmsService);
//# sourceMappingURL=sms.service.js.map