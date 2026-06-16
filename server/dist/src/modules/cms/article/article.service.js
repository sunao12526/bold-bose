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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
const pagination_1 = require("../../../shared/pagination");
let ArticleService = class ArticleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { tagIds, ...articleData } = data;
        const article = await this.prisma.cmsArticle.create({ data: articleData });
        if (tagIds && tagIds.length > 0) {
            await this.prisma.cmsArticleTag.createMany({
                data: tagIds.map((tagId) => ({ articleId: article.id, tagId })),
            });
        }
        return this.findOne(article.id);
    }
    async findAll(query) {
        const where = {};
        if (query?.categoryId)
            where.categoryId = Number(query.categoryId);
        if (query?.status)
            where.status = query.status;
        if (query?.title)
            where.title = { contains: query.title };
        return (0, pagination_1.paginateQuery)(this.prisma, 'cmsArticle', query || {}, {
            where,
            include: {
                category: { select: { id: true, name: true } },
                tags: { include: { tag: { select: { id: true, name: true } } } },
            },
            orderBy: [
                { isTop: 'desc' },
                { sortOrder: 'asc' },
                { createdAt: 'desc' },
            ],
        });
    }
    async findOne(id) {
        const record = await this.prisma.cmsArticle.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true } },
                tags: { include: { tag: { select: { id: true, name: true } } } },
                comments: { orderBy: { createdAt: 'desc' }, take: 20 },
            },
        });
        if (!record)
            throw new common_1.NotFoundException('文章不存在');
        return record;
    }
    async update(id, data) {
        await this.findOne(id);
        const { tagIds, ...articleData } = data;
        await this.prisma.cmsArticle.update({ where: { id }, data: articleData });
        if (tagIds !== undefined) {
            await this.prisma.cmsArticleTag.deleteMany({ where: { articleId: id } });
            if (tagIds.length > 0) {
                await this.prisma.cmsArticleTag.createMany({
                    data: tagIds.map((tagId) => ({ articleId: id, tagId })),
                });
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.cmsArticle.delete({ where: { id } });
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.cmsArticle.update({
            where: { id },
            data: { status: status },
        });
    }
    async incrementView(id) {
        return this.prisma.cmsArticle.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticleService);
//# sourceMappingURL=article.service.js.map