import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.cmsBanner.create({ data });
  }

  async findAll(query?: any) {
    return paginateQuery(this.prisma, 'cmsBanner', query || {}, {
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.cmsBanner.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('轮播图不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.cmsBanner.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cmsBanner.delete({ where: { id } });
  }
}
