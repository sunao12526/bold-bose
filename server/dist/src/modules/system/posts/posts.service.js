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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.post.create({ data });
    }
    async findAll(query) {
        const where = {};
        if (query?.name) {
            where.name = { contains: query.name };
        }
        if (query?.code) {
            where.code = { contains: query.code };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.post.findMany({
            where,
            orderBy: { sort: 'asc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.post.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('数据记录不存在');
        return record;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.post.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.post.delete({ where: { id } });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map