import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UserCacheService } from '../../shared/user-cache.service';
import { paginateQuery } from '../../shared/pagination';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private userCache: UserCacheService,
  ) {}

  async create(data: any) {
    return this.prisma.role.create({ data });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.code) {
      where.code = { contains: query.code };
    }
    if (query?.status) {
      where.status = query.status;
    }

    return paginateQuery(this.prisma, 'role', query || {}, {
      where,
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
    const result = await this.prisma.role.update({ where: { id }, data });
    this.userCache.invalidateAll();
    return result;
  }

  async remove(id: number) {
    const userCount = await this.prisma.userRole.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new Error('该角色下还有用户，无法删除');
    }
    return this.prisma.role.delete({ where: { id } });
  }

  async assignMenus(roleId: number, menuIds: number[]) {
    await this.prisma.roleMenu.deleteMany({ where: { roleId } });
    if (menuIds.length > 0) {
      const mappings = menuIds.map((menuId) => ({ roleId, menuId }));
      await this.prisma.roleMenu.createMany({ data: mappings });
    }
    this.userCache.invalidateAll();
    return { success: true };
  }
}
