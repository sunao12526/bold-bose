import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class TenantPackageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: {
    page?: number | string;
    pageSize?: number | string;
    name?: string;
    status?: CommonStatus;
  }) {
    const where: any = {};
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return paginateQuery(this.prisma, 'tenantPackage', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findSimpleList() {
    return this.prisma.tenantPackage.findMany({
      where: { status: CommonStatus.ENABLE },
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const pkg = await this.prisma.tenantPackage.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException('租户套餐不存在');
    }
    return pkg;
  }

  async create(data: {
    name: string;
    status?: CommonStatus;
    remark?: string | null;
    menuIds?: number[];
  }) {
    const existing = await this.prisma.tenantPackage.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new BadRequestException('租户套餐名称已存在');
    }
    return this.prisma.tenantPackage.create({
      data: {
        name: data.name,
        status: data.status ?? CommonStatus.ENABLE,
        remark: data.remark ?? null,
        menuIds: data.menuIds ?? [],
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      status?: CommonStatus;
      remark?: string | null;
      menuIds?: number[];
    },
  ) {
    await this.findOne(id);
    if (data.name) {
      const dup = await this.prisma.tenantPackage.findFirst({
        where: { name: data.name, id: { not: id } },
      });
      if (dup) {
        throw new BadRequestException('租户套餐名称已存在');
      }
    }
    return this.prisma.tenantPackage.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const usedCount = await this.prisma.tenant.count({
      where: { packageId: id },
    });
    if (usedCount > 0) {
      throw new BadRequestException('该租户套餐已被租户使用，无法删除');
    }
    return this.prisma.tenantPackage.delete({ where: { id } });
  }
}
