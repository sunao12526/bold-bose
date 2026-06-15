import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.cmsTag.create({ data });
  }

  async findAll() {
    return this.prisma.cmsTag.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.cmsTag.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('标签不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.cmsTag.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cmsTag.delete({ where: { id } });
  }
}
