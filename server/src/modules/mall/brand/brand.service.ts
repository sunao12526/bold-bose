import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.mallBrand.create({ data });
  }

  async findAll() {
    return this.prisma.mallBrand.findMany({
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.mallBrand.findUnique({
      where: { id },
    });
    if (!brand) throw new NotFoundException('商品品牌不存在');
    return brand;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mallBrand.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Check if brand is associated with any products (MallSpu)
    const spuCount = await this.prisma.mallSpu.count({
      where: { brandId: id },
    });
    if (spuCount > 0) {
      throw new BadRequestException('该品牌下存在关联商品，无法直接删除');
    }

    return this.prisma.mallBrand.delete({
      where: { id },
    });
  }
}
