import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class DictDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.dictData.create({ data });
  }

  async findAll(query?: { dictType?: string; status?: string }) {
    const where: any = {};
    if (query?.dictType) {
      where.dictType = query.dictType;
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.dictData.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });
  }

  async findOne(id: number) {
    const data = await this.prisma.dictData.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('字典数据不存在');
    return data;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.dictData.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.dictData.delete({ where: { id } });
  }
}
