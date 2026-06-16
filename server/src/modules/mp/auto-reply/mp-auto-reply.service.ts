import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpAutoReplyService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.mpAutoReply.create({ data }); }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.type) where.type = Number(query.type);
    return this.prisma.mpAutoReply.findMany({ where, orderBy: { sort: 'asc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpAutoReply.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('自动回复不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpAutoReply.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpAutoReply.delete({ where: { id } });
  }
}
