import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async add(memberId: number, skuId: number, count = 1) {
    if (count <= 0) {
      throw new BadRequestException('加入数量必须大于 0');
    }

    const sku = await this.prisma.mallSku.findUnique({
      where: { id: skuId },
      include: { spu: true },
    });
    if (!sku || !sku.spu || sku.spu.status !== CommonStatus.ENABLE) {
      throw new NotFoundException('商品规格不存在或已下架');
    }

    const existing = await this.prisma.mallCart.findUnique({
      where: { memberId_skuId: { memberId, skuId } },
    });
    const nextCount = (existing?.count ?? 0) + count;
    if (sku.stock < nextCount) {
      throw new BadRequestException('商品库存不足');
    }

    if (existing) {
      return this.prisma.mallCart.update({
        where: { id: existing.id },
        data: { count: nextCount, selected: true },
      });
    }

    return this.prisma.mallCart.create({
      data: {
        memberId,
        spuId: sku.spuId,
        skuId,
        count,
        selected: true,
      },
    });
  }

  async updateCount(memberId: number, id: number, count: number) {
    const item = await this.prisma.mallCart.findFirst({
      where: { id, memberId },
    });
    if (!item) throw new NotFoundException('购物车项不存在');

    const sku = await this.prisma.mallSku.findUnique({
      where: { id: item.skuId },
    });
    if (!sku || sku.stock < count) {
      throw new BadRequestException('商品库存不足');
    }

    return this.prisma.mallCart.update({
      where: { id },
      data: { count },
    });
  }

  async updateSelected(memberId: number, ids: number[], selected: boolean) {
    await this.prisma.mallCart.updateMany({
      where: { memberId, id: { in: ids } },
      data: { selected },
    });
    return { success: true };
  }

  async remove(memberId: number, ids: number[]) {
    if (!ids.length) return { count: 0 };
    return this.prisma.mallCart.deleteMany({
      where: { memberId, id: { in: ids } },
    });
  }

  async list(memberId: number) {
    const carts = await this.prisma.mallCart.findMany({
      where: { memberId },
      orderBy: { id: 'desc' },
    });
    if (carts.length === 0) {
      return { validList: [], invalidList: [] };
    }

    const skuIds = carts.map((c) => c.skuId);
    const skus = await this.prisma.mallSku.findMany({
      where: { id: { in: skuIds } },
      include: { spu: true },
    });
    const skuMap = new Map(skus.map((s) => [s.id, s]));

    const validList: any[] = [];
    const invalidList: any[] = [];

    for (const c of carts) {
      const sku = skuMap.get(c.skuId);
      const isValid =
        !!sku &&
        !!sku.spu &&
        sku.spu.status === CommonStatus.ENABLE &&
        sku.stock > 0;
      const entry = {
        ...c,
        sku: sku
          ? {
              id: sku.id,
              price: sku.price,
              stock: sku.stock,
              picUrl: sku.picUrl || sku.spu.picUrl,
              properties: sku.properties,
            }
          : null,
        spu: sku?.spu
          ? {
              id: sku.spu.id,
              name: sku.spu.name,
              picUrl: sku.spu.picUrl,
              status: sku.spu.status,
            }
          : null,
      };
      if (isValid) {
        validList.push(entry);
      } else {
        invalidList.push(entry);
      }
    }

    return { validList, invalidList };
  }

  async getCount(memberId: number): Promise<number> {
    const agg = await this.prisma.mallCart.aggregate({
      where: { memberId },
      _sum: { count: true },
    });
    return agg._sum.count ?? 0;
  }
}
