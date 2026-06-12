"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const config_service_1 = require("../config/config.service");
const nodemailer = __importStar(require("nodemailer"));
let NotifyService = class NotifyService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async createTemplate(data) {
        const existing = await this.prisma.notifyTemplate.findUnique({
            where: { code: data.code },
        });
        if (existing)
            throw new common_1.BadRequestException('模板编码已存在');
        return this.prisma.notifyTemplate.create({ data });
    }
    async findAllTemplates() {
        return this.prisma.notifyTemplate.findMany({
            orderBy: { id: 'asc' },
        });
    }
    async findOneTemplate(id) {
        const template = await this.prisma.notifyTemplate.findUnique({
            where: { id },
        });
        if (!template)
            throw new common_1.NotFoundException('通知模板不存在');
        return template;
    }
    async updateTemplate(id, data) {
        await this.findOneTemplate(id);
        if (data.code) {
            const existing = await this.prisma.notifyTemplate.findFirst({
                where: { code: data.code, id: { not: id } },
            });
            if (existing)
                throw new common_1.BadRequestException('模板编码已存在');
        }
        return this.prisma.notifyTemplate.update({
            where: { id },
            data,
        });
    }
    async removeTemplate(id) {
        await this.findOneTemplate(id);
        return this.prisma.notifyTemplate.delete({
            where: { id },
        });
    }
    render(templateStr, variables) {
        if (!templateStr)
            return '';
        return templateStr.replace(/\{([^{}]+)\}/g, (match, key) => {
            const cleanedKey = key.trim();
            return variables[cleanedKey] !== undefined ? variables[cleanedKey] : match;
        });
    }
    async send(userId, templateCode, variables = {}) {
        const template = await this.prisma.notifyTemplate.findUnique({
            where: { code: templateCode },
        });
        if (!template) {
            throw new common_1.NotFoundException(`通知模板 [${templateCode}] 不存在`);
        }
        if (template.status === 'DISABLE') {
            throw new common_1.BadRequestException(`通知模板 [${templateCode}] 已被禁用`);
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`目标用户 [ID: ${userId}] 不存在`);
        }
        const mergedVariables = {
            username: user.username,
            nickname: user.nickname,
            email: user.email || '',
            mobile: user.mobile || '',
            ...variables,
        };
        const renderedTitle = this.render(template.title, mergedVariables);
        const renderedContent = this.render(template.content, mergedVariables);
        let status = 200;
        let errorMessage = null;
        if (template.type === 'SYSTEM') {
            try {
                await this.prisma.notifyMessage.create({
                    data: {
                        templateId: template.id,
                        templateCode: template.code,
                        userId: user.id,
                        username: user.username,
                        title: renderedTitle,
                        content: renderedContent,
                        status: 200,
                    },
                });
            }
            catch (err) {
                status = 500;
                errorMessage = err.message || '写入站内信失败';
            }
        }
        else if (template.type === 'EMAIL') {
            if (!user.email) {
                status = 500;
                errorMessage = `用户 [${user.username}] 未绑定邮箱地址`;
            }
            else {
                try {
                    await this.sendEmail(user.email, renderedTitle, renderedContent);
                }
                catch (err) {
                    status = 500;
                    errorMessage = err.message || '发送邮件失败';
                }
            }
            await this.prisma.notifyMessage.create({
                data: {
                    templateId: template.id,
                    templateCode: template.code,
                    userId: user.id,
                    username: user.username,
                    title: renderedTitle,
                    content: renderedContent,
                    status,
                    errorMessage,
                },
            });
        }
        else if (template.type === 'SMS') {
            console.log(`[SMS SEND SIMULATION] To: ${user.mobile || 'Unknown'}, Body: ${renderedContent}`);
            if (!user.mobile) {
                status = 500;
                errorMessage = `用户 [${user.username}] 未绑定手机号`;
            }
            await this.prisma.notifyMessage.create({
                data: {
                    templateId: template.id,
                    templateCode: template.code,
                    userId: user.id,
                    username: user.username,
                    title: renderedTitle,
                    content: renderedContent,
                    status,
                    errorMessage,
                },
            });
        }
        else {
            throw new common_1.BadRequestException(`未知的通知类型 [${template.type}]`);
        }
        if (status !== 200) {
            throw new Error(errorMessage || '通知发送失败');
        }
        return { success: true };
    }
    async sendEmail(to, subject, htmlContent) {
        let host = 'smtp.mailtrap.io';
        let port = 2525;
        let username = '';
        let password = '';
        let secure = false;
        let from = 'system@yudao.local';
        try {
            const configHost = await this.configService.findByKey('sys.mail.host');
            host = configHost.value;
            const configPort = await this.configService.findByKey('sys.mail.port');
            port = parseInt(configPort.value, 10) || port;
            const configUsername = await this.configService.findByKey('sys.mail.username');
            username = configUsername.value;
            const configPassword = await this.configService.findByKey('sys.mail.password');
            password = configPassword.value;
            const configSsl = await this.configService.findByKey('sys.mail.ssl');
            secure = configSsl.value === 'true' || configSsl.value === '1';
            const configFrom = await this.configService.findByKey('sys.mail.from');
            from = configFrom.value;
        }
        catch (err) {
            console.warn('Unable to load SMTP configurations from SysConfig, falling back to process env defaults.');
            host = process.env.SMTP_HOST || host;
            port = parseInt(process.env.SMTP_PORT || '', 10) || port;
            username = process.env.SMTP_USERNAME || username;
            password = process.env.SMTP_PASSWORD || password;
            secure = process.env.SMTP_SSL === 'true' || secure;
            from = process.env.SMTP_FROM || from;
        }
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: username && password ? { user: username, pass: password } : undefined,
        });
        await transporter.sendMail({
            from,
            to,
            subject,
            html: htmlContent,
        });
    }
    async getMyInbox(userId) {
        return this.prisma.notifyMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markRead(userId, messageId) {
        const msg = await this.prisma.notifyMessage.findFirst({
            where: { id: messageId, userId },
        });
        if (!msg)
            throw new common_1.NotFoundException('消息不存在或不属于当前用户');
        return this.prisma.notifyMessage.update({
            where: { id: messageId },
            data: {
                read: true,
                readTime: new Date(),
            },
        });
    }
    async markAllRead(userId) {
        return this.prisma.notifyMessage.updateMany({
            where: { userId, read: false },
            data: {
                read: true,
                readTime: new Date(),
            },
        });
    }
};
exports.NotifyService = NotifyService;
exports.NotifyService = NotifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService])
], NotifyService);
//# sourceMappingURL=notify.service.js.map