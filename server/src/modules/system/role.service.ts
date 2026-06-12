import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.role.create({ data });
  }

  async findAll() {
    return this.prisma.role.findMany({
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { menus: { select: { menuId: true } } },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }

  async assignMenus(roleId: number, menuIds: number[]) {
    await this.prisma.roleMenu.deleteMany({ where: { roleId } });
    if (menuIds.length > 0) {
      const mappings = menuIds.map((menuId) => ({ roleId, menuId }));
      await this.prisma.roleMenu.createMany({ data: mappings });
    }
    return { success: true };
  }
}
