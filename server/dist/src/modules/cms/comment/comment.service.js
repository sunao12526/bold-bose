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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(articleId, data) {
        const article = await this.prisma.cmsArticle.findUnique({ where: { id: articleId } });
        if (!article)
            throw new common_1.NotFoundException('文章不存在');
        return this.prisma.cmsComment.create({
            data: {
                articleId,
                userId: data.userId || null,
                nickname: data.nickname,
                content: data.content,
            },
        });
    }
    async findAll(query) {
        const where = {};
        if (query?.articleId)
            where.articleId = Number(query.articleId);
        if (query?.status)
            where.status = query.status;
        return this.prisma.cmsComment.findMany({
            where,
            include: {
                article: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const record = await this.prisma.cmsComment.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('评论不存在');
        return record;
    }
    async approve(id) {
        await this.findOne(id);
        return this.prisma.cmsComment.update({
            where: { id },
            data: { status: 'APPROVED' },
        });
    }
    async reject(id) {
        await this.findOne(id);
        return this.prisma.cmsComment.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.cmsComment.delete({ where: { id } });
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
//# sourceMappingURL=comment.service.js.map