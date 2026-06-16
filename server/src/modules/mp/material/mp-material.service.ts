import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpMaterialService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.mpMaterial.create({ data });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.type) where.type = query.type;
    return this.prisma.mpMaterial.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpMaterial.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('素材不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpMaterial.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpMaterial.delete({ where: { id } });
  }
}
