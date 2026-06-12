import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.menu.create({ data });
  }

  async findAll() {
    return this.prisma.menu.findMany({
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.menu.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.menu.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const children = await this.prisma.menu.findFirst({ where: { parentId: id } });
    if (children) {
      throw new BadRequestException('该菜单包含子菜单，无法删除');
    }
    return this.prisma.menu.delete({ where: { id } });
  }
}
