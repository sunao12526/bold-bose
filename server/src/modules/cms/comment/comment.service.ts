import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(articleId: number, data: any) {
    const article = await this.prisma.cmsArticle.findUnique({ where: { id: articleId } });
    if (!article) throw new NotFoundException('文章不存在');
    return this.prisma.cmsComment.create({
      data: {
        articleId,
        userId: data.userId || null,
        nickname: data.nickname,
        content: data.content,
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.articleId) where.articleId = Number(query.articleId);
    if (query?.status) where.status = query.status;
    return this.prisma.cmsComment.findMany({
      where,
      include: {
        article: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.cmsComment.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('评论不存在');
    return record;
  }

  async approve(id: number) {
    await this.findOne(id);
    return this.prisma.cmsComment.update({
      where: { id },
      data: { status: 'APPROVED' as any },
    });
  }

  async reject(id: number) {
    await this.findOne(id);
    return this.prisma.cmsComment.update({
      where: { id },
      data: { status: 'REJECTED' as any },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cmsComment.delete({ where: { id } });
  }
}
