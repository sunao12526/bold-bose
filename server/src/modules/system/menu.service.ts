import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserCacheService } from '../../shared/user-cache.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private userCache: UserCacheService,
  ) {}

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
    const result = await this.prisma.menu.update({
      where: { id },
      data,
    });
    this.userCache.invalidateAll();
    return result;
  }

  async remove(id: number) {
    const children = await this.prisma.menu.findFirst({
      where: { parentId: id },
    });
    if (children) {
      throw new BadRequestException('该菜单包含子菜单，无法删除');
    }
    const result = await this.prisma.menu.delete({ where: { id } });
    this.userCache.invalidateAll();
    return result;
  }
}
