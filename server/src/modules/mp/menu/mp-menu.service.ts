import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpMenuService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.mpMenu.create({ data });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    return this.prisma.mpMenu.findMany({ where, orderBy: { sort: 'asc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpMenu.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('菜单不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpMenu.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpMenu.delete({ where: { id } });
  }
}
