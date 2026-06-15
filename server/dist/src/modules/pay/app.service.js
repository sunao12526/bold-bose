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
exports.PayAppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
let PayAppService = class PayAppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.payApp.findUnique({
            where: { code: data.code },
        });
        if (existing) {
            throw new common_1.BadRequestException('应用编码已存在');
        }
        return this.prisma.payApp.create({ data });
    }
    async findAll() {
        return this.prisma.payApp.findMany({
            include: {
                channels: true,
            },
            orderBy: { id: 'asc' },
        });
    }
    async findOne(id) {
        const app = await this.prisma.payApp.findUnique({
            where: { id },
            include: {
                channels: true,
            },
        });
        if (!app)
            throw new common_1.NotFoundException('支付应用不存在');
        return app;
    }
    async findByCode(code) {
        const app = await this.prisma.payApp.findUnique({
            where: { code },
        });
        if (!app)
            throw new common_1.NotFoundException('支付应用不存在');
        return app;
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.code) {
            const existing = await this.prisma.payApp.findFirst({
                where: { code: data.code, id: { not: id } },
            });
            if (existing) {
                throw new common_1.BadRequestException('应用编码已存在');
            }
        }
        return this.prisma.payApp.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.payApp.delete({ where: { id } });
    }
};
exports.PayAppService = PayAppService;
exports.PayAppService = PayAppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayAppService);
//# sourceMappingURL=app.service.js.map