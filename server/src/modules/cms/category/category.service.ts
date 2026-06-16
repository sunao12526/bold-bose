import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.cmsCategory.create({ data });
  }

  async findAll(query?: any) {
    return paginateQuery(this.prisma, 'cmsCategory', query || {}, {
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.cmsCategory.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('分类不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.cmsCategory.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    const count = await this.prisma.cmsArticle.count({ where: { categoryId: id } });
    if (count > 0) throw new NotFoundException('该分类下还有文章，无法删除');
    return this.prisma.cmsCategory.delete({ where: { id } });
  }
}
