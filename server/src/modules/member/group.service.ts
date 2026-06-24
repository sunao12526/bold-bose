import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }
    if (query?.status) {
      where.status = query.status;
    }

    if (query?.page || query?.pageSize) {
      const page = Number(query.page || 1);
      const pageSize = Number(query.pageSize || 20);
      const [items, total] = await Promise.all([
        this.prisma.memberGroup.findMany({
          where,
          orderBy: { id: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.prisma.memberGroup.count({ where }),
      ]);
      return { items, total };
    }

    const items = await this.prisma.memberGroup.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { items, total: items.length };
  }

  async findOne(id: number) {
    const group = await this.prisma.memberGroup.findUnique({
      where: { id },
    });
    if (!group) throw new NotFoundException('会员分组不存在');
    return group;
  }

  async create(data: any) {
    return this.prisma.memberGroup.create({
      data: {
        name: data.name,
        status: data.status || CommonStatus.ENABLE,
        description: data.description,
      },
    });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.memberGroup.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
        description: data.description,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Remove group binding from users first
    await this.prisma.memberUser.updateMany({
      where: { groupId: id },
      data: { groupId: null },
    });

    return this.prisma.memberGroup.delete({
      where: { id },
    });
  }
}
