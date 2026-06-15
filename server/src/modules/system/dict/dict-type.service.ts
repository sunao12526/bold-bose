import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class DictTypeService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.dictType.findUnique({
      where: { type: data.type },
    });
    if (existing) throw new BadRequestException('字典类型已存在');
    return this.prisma.dictType.create({ data });
  }

  async findAll() {
    return this.prisma.dictType.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    return this.prisma.dictType.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.dictType.update({ where: { id }, data });
  }

  async remove(id: number) {
    const type = await this.prisma.dictType.findUnique({ where: { id } });
    if (!type) throw new BadRequestException('字典类型不存在');

    const count = await this.prisma.dictData.count({
      where: { dictType: type.type },
    });
    if (count > 0)
      throw new BadRequestException('该字典类型包含数据，无法删除');

    return this.prisma.dictType.delete({ where: { id } });
  }
}
