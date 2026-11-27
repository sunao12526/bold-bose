import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class InteractionService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= Product Comments =================

  async findComments(query?: {
    page?: number | string;
    pageSize?: number | string;
    spuId?: number | string;
    spuName?: string;
    visible?: string | boolean;
    replyStatus?: string | boolean;
  }) {
    const where: any = {};
    if (query?.spuId) where.spuId = Number(query.spuId);
    if (query?.spuName) where.spuName = { contains: query.spuName };
    if (query?.visible !== undefined && query.visible !== '') {
      where.visible = query.visible === true || query.visible === 'true';
    }
    if (query?.replyStatus !== undefined && query.replyStatus !== '') {
      where.replyStatus =
        query.replyStatus === true || query.replyStatus === 'true';
    }

    return paginateQuery(this.prisma, 'mallProductComment', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async updateCommentVisible(id: number, visible: boolean) {
    const existing = await this.prisma.mallProductComment.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('商品评价不存在');
    return this.prisma.mallProductComment.update({
      where: { id },
      data: { visible },
    });
  }

  async replyComment(id: number, replyUserId: number, replyContent: string) {
    const existing = await this.prisma.mallProductComment.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('商品评价不存在');
    return this.prisma.mallProductComment.update({
      where: { id },
      data: {
        replyStatus: true,
        replyUserId,
        replyContent,
        replyTime: new Date(),
      },
    });
  }

  async createComment(
    memberId: number,
    data: {
      spuId: number;
      skuId?: number;
      orderId?: number;
      orderItemId?: number;
      anonymous?: boolean;
      scores: number;
      descriptionScores?: number;
      benefitScores?: number;
      content: string;
      picUrls?: string[];
    },
  ) {
    const [member, spu] = await Promise.all([
      this.prisma.memberUser.findUnique({ where: { id: memberId } }),
      this.prisma.mallSpu.findUnique({ where: { id: data.spuId } }),
    ]);
    if (!member) throw new NotFoundException('会员不存在');
    if (!spu) throw new NotFoundException('商品不存在');

    return this.prisma.mallProductComment.create({
      data: {
        memberId,
        userNickname: data.anonymous ? '匿名用户' : member.nickname,
        userAvatar: data.anonymous ? null : member.avatar,
        anonymous: !!data.anonymous,
        orderId: data.orderId ?? null,
        orderItemId: data.orderItemId ?? null,
        spuId: spu.id,
        spuName: spu.name,
        skuId: data.skuId ?? null,
        scores: data.scores,
        descriptionScores: data.descriptionScores ?? data.scores,
        benefitScores: data.benefitScores ?? data.scores,
        content: data.content,
        picUrls: data.picUrls ?? [],
      },
    });
  }

  // ================= Product Favorites =================

  async addFavorite(memberId: number, spuId: number) {
    const spu = await this.prisma.mallSpu.findUnique({ where: { id: spuId } });
    if (!spu) throw new NotFoundException('商品不存在');

    return this.prisma.mallProductFavorite.upsert({
      where: { memberId_spuId: { memberId, spuId } },
      create: { memberId, spuId },
      update: {},
    });
  }

  async removeFavorite(memberId: number, spuId: number) {
    await this.prisma.mallProductFavorite.deleteMany({
      where: { memberId, spuId },
    });
    return { success: true };
  }

  async isFavorite(memberId: number, spuId: number) {
    const fav = await this.prisma.mallProductFavorite.findUnique({
      where: { memberId_spuId: { memberId, spuId } },
    });
    return !!fav;
  }

  async findFavorites(
    memberId: number,
    query?: { page?: number | string; pageSize?: number | string },
  ) {
    const res = await paginateQuery<any>(
      this.prisma,
      'mallProductFavorite',
      query || {},
      {
        where: { memberId },
        orderBy: { id: 'desc' },
      },
    );
    const spuIds = res.items.map((f) => f.spuId);
    const spus = spuIds.length
      ? await this.prisma.mallSpu.findMany({
          where: { id: { in: spuIds } },
          select: { id: true, name: true, picUrl: true, minPrice: true, status: true },
        })
      : [];
    const spuMap = new Map(spus.map((s) => [s.id, s]));
    return {
      total: res.total,
      items: res.items.map((f) => ({
        ...f,
        spu: spuMap.get(f.spuId) ?? null,
      })),
    };
  }
}
