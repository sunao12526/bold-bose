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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let TagService = class TagService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.memberTag.findUnique({
            where: { name: data.name },
        });
        if (existing) {
            throw new common_1.BadRequestException(`标签名称 [${data.name}] 已存在`);
        }
        return this.prisma.memberTag.create({
            data: {
                name: data.name,
                description: data.description,
                status: data.status || client_1.CommonStatus.ENABLE,
            },
        });
    }
    async findAll() {
        return this.prisma.memberTag.findMany({
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const tag = await this.prisma.memberTag.findUnique({
            where: { id },
        });
        if (!tag)
            throw new common_1.NotFoundException('会员标签不存在');
        return tag;
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.name !== undefined) {
            const existing = await this.prisma.memberTag.findFirst({
                where: {
                    name: data.name,
                    id: { not: id },
                },
            });
            if (existing) {
                throw new common_1.BadRequestException(`标签名称 [${data.name}] 已存在`);
            }
        }
        return this.prisma.memberTag.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                status: data.status,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.memberTag.delete({
            where: { id },
        });
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagService);
//# sourceMappingURL=tag.service.js.map