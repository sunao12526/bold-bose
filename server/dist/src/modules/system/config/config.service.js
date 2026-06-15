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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let ConfigService = class ConfigService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.sysConfig.findUnique({
            where: { key: data.key },
        });
        if (existing)
            throw new common_1.BadRequestException('配置键名已存在');
        return this.prisma.sysConfig.create({ data });
    }
    async findAll() {
        return this.prisma.sysConfig.findMany({ orderBy: { id: 'asc' } });
    }
    async findOne(id) {
        const config = await this.prisma.sysConfig.findUnique({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('配置项不存在');
        return config;
    }
    async findByKey(key) {
        const config = await this.prisma.sysConfig.findUnique({ where: { key } });
        if (!config)
            throw new common_1.NotFoundException(`配置键名 ${key} 不存在`);
        return config;
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.key) {
            const existing = await this.prisma.sysConfig.findFirst({
                where: { key: data.key, id: { not: id } },
            });
            if (existing)
                throw new common_1.BadRequestException('配置键名已存在');
        }
        return this.prisma.sysConfig.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.sysConfig.delete({ where: { id } });
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConfigService);
//# sourceMappingURL=config.service.js.map