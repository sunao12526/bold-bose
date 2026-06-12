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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayChannelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let PayChannelService = class PayChannelService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrUpdate(data) {
        const app = await this.prisma.payApp.findUnique({ where: { id: data.appId } });
        if (!app) {
            throw new common_1.NotFoundException('支付应用不存在');
        }
        let parsedConfig = data.config;
        if (typeof data.config === 'string') {
            try {
                parsedConfig = JSON.parse(data.config);
            }
            catch (e) {
                throw new common_1.BadRequestException('配置参数必须是有效的 JSON 格式');
            }
        }
        const existing = await this.prisma.payChannel.findUnique({
            where: {
                appId_code: {
                    appId: data.appId,
                    code: data.code,
                },
            },
        });
        if (existing) {
            return this.prisma.payChannel.update({
                where: { id: existing.id },
                data: {
                    config: parsedConfig,
                    status: data.status,
                    remark: data.remark,
                },
            });
        }
        else {
            return this.prisma.payChannel.create({
                data: {
                    appId: data.appId,
                    code: data.code,
                    config: parsedConfig,
                    status: data.status ?? client_1.CommonStatus.ENABLE,
                    remark: data.remark,
                },
            });
        }
    }
    async findChannel(appId, code) {
        const channel = await this.prisma.payChannel.findUnique({
            where: {
                appId_code: {
                    appId,
                    code,
                },
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException(`通道 [${code}] 配置不存在`);
        }
        return channel;
    }
    async findByApp(appId) {
        return this.prisma.payChannel.findMany({
            where: { appId },
            orderBy: { id: 'asc' },
        });
    }
    async remove(id) {
        const channel = await this.prisma.payChannel.findUnique({ where: { id } });
        if (!channel)
            throw new common_1.NotFoundException('支付通道不存在');
        return this.prisma.payChannel.delete({ where: { id } });
    }
};
exports.PayChannelService = PayChannelService;
exports.PayChannelService = PayChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayChannelService);
//# sourceMappingURL=channel.service.js.map