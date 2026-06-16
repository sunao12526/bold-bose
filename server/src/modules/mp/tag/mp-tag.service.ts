import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpTagService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.mpTag.create({ data }); }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    return this.prisma.mpTag.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpTag.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('标签不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpTag.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpTag.delete({ where: { id } });
  }
}
