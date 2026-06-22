import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateSpuDto, UpdateSpuDto, SpuQueryDto } from './dto/spu.dto';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class SpuService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSpuDto) {
    const { skus, ...spuData } = data;

    // Calculate SPU aggregate fields based on SKUs
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let totalStock = 0;

    if (skus && skus.length > 0) {
      for (const sku of skus) {
        minPrice = Math.min(minPrice, sku.price || 0);
        maxPrice = Math.max(maxPrice, sku.price || 0);
        totalStock += sku.stock || 0;
      }
    } else {
      minPrice = 0;
      maxPrice = 0;
    }

    return this.prisma.$transaction(async (tx) => {
      return tx.mallSpu.create({
        data: {
          ...spuData,
          minPrice,
          maxPrice,
          totalStock,
          skus:
            skus && skus.length > 0
              ? {
                  create: skus.map((sku: any) => ({
                    properties: sku.properties || [],
                    price: sku.price || 0,
                    marketPrice: sku.marketPrice || null,
                    costPrice: sku.costPrice || null,
                    stock: sku.stock || 0,
                    picUrl: sku.picUrl || null,
                    barCode: sku.barCode || null,
                  })),
                }
              : undefined,
        },
        include: { skus: true },
      });
    });
  }

  async findAll(query: SpuQueryDto) {
    const where: any = {};
    if (query.name) {
      where.name = { contains: query.name };
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.brandId) {
      where.brandId = query.brandId;
    }
    if (query.status) {
      where.status = query.status;
    }

    return paginateQuery(this.prisma, 'mallSpu', query, {
      where,
      include: {
        skus: true,
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
      },
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    const spu = await this.prisma.mallSpu.findUnique({
      where: { id },
      include: { skus: true },
    });
    if (!spu) throw new NotFoundException('商品不存在');
    return spu;
  }

  async update(id: number, data: UpdateSpuDto) {
    await this.findOne(id);
    const { skus, ...spuData } = data;

    // Calculate SPU aggregate fields based on updated SKUs
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let totalStock = 0;

    if (skus && skus.length > 0) {
      for (const sku of skus) {
        minPrice = Math.min(minPrice, sku.price || 0);
        maxPrice = Math.max(maxPrice, sku.price || 0);
        totalStock += sku.stock || 0;
      }
    } else {
      minPrice = 0;
      maxPrice = 0;
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete all old SKUs
      await tx.mallSku.deleteMany({
        where: { spuId: id },
      });

      // 2. Update SPU and create new SKUs
      return tx.mallSpu.update({
        where: { id },
        data: {
          ...spuData,
          minPrice,
          maxPrice,
          totalStock,
          skus:
            skus && skus.length > 0
              ? {
                  create: skus.map((sku: any) => ({
                    properties: sku.properties || [],
                    price: sku.price || 0,
                    marketPrice: sku.marketPrice || null,
                    costPrice: sku.costPrice || null,
                    stock: sku.stock || 0,
                    picUrl: sku.picUrl || null,
                    barCode: sku.barCode || null,
                  })),
                }
              : undefined,
        },
        include: { skus: true },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Casacade delete will handle deleting SKUs automatically
    return this.prisma.mallSpu.delete({
      where: { id },
    });
  }
}
