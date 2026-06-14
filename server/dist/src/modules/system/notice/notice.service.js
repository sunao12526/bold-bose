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
exports.NoticeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let NoticeService = class NoticeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.notice.create({
            data: {
                title: data.title,
                type: Number(data.type),
                content: data.content,
                status: data.status || 'ENABLE',
            },
        });
    }
    async findAll(query) {
        const where = {};
        if (query?.title) {
            where.title = { contains: query.title };
        }
        if (query?.type) {
            where.type = Number(query.type);
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.notice.findMany({
            where,
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.notice.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('公告不存在');
        return record;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.notice.update({
            where: { id },
            data: {
                title: data.title,
                type: data.type !== undefined ? Number(data.type) : undefined,
                content: data.content,
                status: data.status,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.notice.delete({ where: { id } });
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NoticeService);
//# sourceMappingURL=notice.service.js.map