import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (data.parentId) {
      const parent = await this.prisma.mallCategory.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new BadRequestException('父分类不存在');
    }
    return this.prisma.mallCategory.create({ data });
  }

  async findAll() {
    return this.prisma.mallCategory.findMany({
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.mallCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('商品分类不存在');
    return category;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    if (data.parentId) {
      if (data.parentId === id) {
        throw new BadRequestException('父分类不能是自己本身');
      }
      const parent = await this.prisma.mallCategory.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new BadRequestException('父分类不存在');
    }
    return this.prisma.mallCategory.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Check if category has children
    const childrenCount = await this.prisma.mallCategory.count({
      where: { parentId: id },
    });
    if (childrenCount > 0) {
      throw new BadRequestException('存在子分类，无法直接删除');
    }

    // Check if category is used in SPU
    const spuCount = await this.prisma.mallSpu.count({
      where: { categoryId: id },
    });
    if (spuCount > 0) {
      throw new BadRequestException('该分类下存在关联商品，无法直接删除');
    }

    return this.prisma.mallCategory.delete({
      where: { id },
    });
  }
}
