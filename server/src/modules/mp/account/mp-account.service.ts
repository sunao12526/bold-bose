import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpAccountService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.mpAccount.create({ data });
  }

  async findAll() {
    return this.prisma.mpAccount.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpAccount.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('公众号账号不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpAccount.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpAccount.delete({ where: { id } });
  }
}
