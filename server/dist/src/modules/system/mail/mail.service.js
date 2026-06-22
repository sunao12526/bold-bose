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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    prisma;
    logger = new common_1.Logger(MailService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAccount(data) {
        return this.prisma.mailAccount.create({
            data: {
                mail: data.mail,
                username: data.username,
                password: data.password,
                host: data.host,
                port: Number(data.port),
                ssl: data.ssl === true || data.ssl === 'true',
                status: data.status || 'ENABLE',
            },
        });
    }
    async findAllAccounts(query) {
        const where = {};
        if (query?.mail) {
            where.mail = { contains: query.mail };
        }
        if (query?.username) {
            where.username = { contains: query.username };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.mailAccount.findMany({
            where,
            orderBy: { id: 'desc' },
        });
    }
    async findOneAccount(id) {
        const record = await this.prisma.mailAccount.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('邮件账号不存在');
        return record;
    }
    async updateAccount(id, data) {
        await this.findOneAccount(id);
        return this.prisma.mailAccount.update({
            where: { id },
            data: {
                mail: data.mail,
                username: data.username,
                password: data.password,
                host: data.host,
                port: data.port !== undefined ? Number(data.port) : undefined,
                ssl: data.ssl !== undefined
                    ? data.ssl === true || data.ssl === 'true'
                    : undefined,
                status: data.status,
            },
        });
    }
    async removeAccount(id) {
        await this.findOneAccount(id);
        const templates = await this.prisma.mailTemplate.findFirst({
            where: { accountId: id },
        });
        if (templates) {
            throw new Error('该账号下还有绑定的邮件模板，无法删除');
        }
        return this.prisma.mailAccount.delete({ where: { id } });
    }
    async createTemplate(data) {
        await this.findOneAccount(Number(data.accountId));
        return this.prisma.mailTemplate.create({
            data: {
                accountId: Number(data.accountId),
                code: data.code,
                name: data.name,
                title: data.title,
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
        return this.prisma.mailTemplate.findMany({
            where,
            orderBy: { id: 'desc' },
            include: { account: true },
        });
    }
    async findOneTemplate(id) {
        const record = await this.prisma.mailTemplate.findUnique({
            where: { id },
            include: { account: true },
        });
        if (!record)
            throw new common_1.NotFoundException('邮件模板不存在');
        return record;
    }
    async updateTemplate(id, data) {
        await this.findOneTemplate(id);
        if (data.accountId !== undefined) {
            await this.findOneAccount(Number(data.accountId));
        }
        return this.prisma.mailTemplate.update({
            where: { id },
            data: {
                accountId: data.accountId !== undefined ? Number(data.accountId) : undefined,
                code: data.code,
                name: data.name,
                title: data.title,
                content: data.content,
                status: data.status,
                remark: data.remark,
            },
        });
    }
    async removeTemplate(id) {
        await this.findOneTemplate(id);
        return this.prisma.mailTemplate.delete({ where: { id } });
    }
    async findAllLogs(query) {
        const where = {};
        if (query?.receiver) {
            where.receiver = { contains: query.receiver };
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.templateId) {
            where.templateId = Number(query.templateId);
        }
        return this.prisma.mailLog.findMany({
            where,
            orderBy: { sendTime: 'desc' },
            include: {
                template: {
                    include: { account: true },
                },
            },
        });
    }
    async sendMail(templateCode, receiver, params) {
        const template = await this.prisma.mailTemplate.findUnique({
            where: { code: templateCode },
            include: { account: true },
        });
        if (!template) {
            throw new Error(`邮件模板 code ${templateCode} 不存在`);
        }
        if (template.status === 'DISABLE') {
            throw new Error(`邮件模板 code ${templateCode} 已禁用`);
        }
        if (template.account.status === 'DISABLE') {
            throw new Error(`邮件账号 ${template.account.mail} 已禁用`);
        }
        let title = template.title;
        let content = template.content;
        Object.keys(params).forEach((key) => {
            const regex = new RegExp(`{${key}}`, 'g');
            title = title.replace(regex, String(params[key]));
            content = content.replace(regex, String(params[key]));
        });
        let status = 'SUCCESS';
        let errorMessage = null;
        try {
            const transporter = nodemailer.createTransport({
                host: template.account.host,
                port: template.account.port,
                secure: template.account.ssl,
                auth: {
                    user: template.account.username,
                    pass: template.account.password,
                },
            });
            await transporter.sendMail({
                from: template.account.mail,
                to: receiver,
                subject: title,
                html: content,
            });
            this.logger.log(`[Mail Service] Email sent successfully to ${receiver} using template ${templateCode}`);
        }
        catch (err) {
            this.logger.error(`[Mail Service] Failed to send email to ${receiver}:`, err.stack || err);
            status = 'FAIL';
            errorMessage = err.message || String(err);
        }
        return this.prisma.mailLog.create({
            data: {
                templateId: template.id,
                receiver,
                title,
                content,
                status,
                errorMessage,
            },
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map