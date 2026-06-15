import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class DeptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    if (data.parentId && data.parentId !== 0) {
      const parent = await this.prisma.dept.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new NotFoundException('父级部门不存在');
    }
    return this.prisma.dept.create({
      data: {
        name: data.name,
        parentId: data.parentId || 0,
        sort: data.sort || 0,
        leaderId: data.leaderId || null,
        phone: data.phone || null,
        email: data.email || null,
        status: data.status || 'ENABLE',
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.dept.findMany({
      where,
      orderBy: { sort: 'asc' },
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.dept.findUnique({
      where: { id },
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    });
    if (!record) throw new NotFoundException('部门不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    if (data.parentId && data.parentId === id) {
      throw new Error('不能选择自己作为父级部门');
    }
    if (data.parentId && data.parentId !== 0) {
      const parent = await this.prisma.dept.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) throw new NotFoundException('父级部门不存在');
    }
    return this.prisma.dept.update({
      where: { id },
      data: {
        name: data.name,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
        sort: data.sort !== undefined ? data.sort : undefined,
        leaderId: data.leaderId !== undefined ? data.leaderId : undefined,
        phone: data.phone !== undefined ? data.phone : undefined,
        email: data.email !== undefined ? data.email : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const children = await this.prisma.dept.findFirst({
      where: { parentId: id },
    });
    if (children) {
      throw new Error('该部门下还有子部门，无法删除');
    }
    const users = await this.prisma.user.findFirst({ where: { deptId: id } });
    if (users) {
      throw new Error('该部门下还有绑定员工，无法删除');
    }
    return this.prisma.dept.delete({ where: { id } });
  }
}
