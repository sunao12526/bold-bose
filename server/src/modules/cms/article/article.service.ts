import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { tagIds, ...articleData } = data;
    const article = await this.prisma.cmsArticle.create({ data: articleData });
    if (tagIds && tagIds.length > 0) {
      await this.prisma.cmsArticleTag.createMany({
        data: tagIds.map((tagId: number) => ({ articleId: article.id, tagId })),
      });
    }
    return this.findOne(article.id);
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.categoryId) where.categoryId = Number(query.categoryId);
    if (query?.status) where.status = query.status;
    if (query?.title) where.title = { contains: query.title };
    return this.prisma.cmsArticle.findMany({
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

  async findOne(id: number) {
    const record = await this.prisma.cmsArticle.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        comments: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!record) throw new NotFoundException('文章不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    const { tagIds, ...articleData } = data;
    await this.prisma.cmsArticle.update({ where: { id }, data: articleData });
    if (tagIds !== undefined) {
      await this.prisma.cmsArticleTag.deleteMany({ where: { articleId: id } });
      if (tagIds.length > 0) {
        await this.prisma.cmsArticleTag.createMany({
          data: tagIds.map((tagId: number) => ({ articleId: id, tagId })),
        });
      }
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cmsArticle.delete({ where: { id } });
  }

  async updateStatus(id: number, status: string) {
    await this.findOne(id);
    return this.prisma.cmsArticle.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async incrementView(id: number) {
    return this.prisma.cmsArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
