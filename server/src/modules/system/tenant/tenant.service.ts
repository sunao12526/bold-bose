import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';
import { TenantContext } from '../../../shared/tenant/tenant-context';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async getIdByName(name: string): Promise<{ id: number } | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { name },
      select: { id: true },
    });
    return tenant;
  }

  async getByWebsite(website: string) {
    return this.prisma.tenant.findFirst({
      where: { website, status: CommonStatus.ENABLE },
      select: { id: true, name: true, website: true },
    });
  }

  async findAll(query?: {
    page?: number | string;
    pageSize?: number | string;
    name?: string;
    contactName?: string;
    contactMobile?: string;
    status?: CommonStatus;
  }) {
    const where: any = {};
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.contactName) {
      where.contactName = { contains: query.contactName };
    }
    if (query?.contactMobile) {
      where.contactMobile = { contains: query.contactMobile };
    }
    if (query?.status) {
      where.status = query.status;
    }

    return paginateQuery(this.prisma, 'tenant', query || {}, {
      where,
      include: { package: { select: { id: true, name: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: { package: { select: { id: true, name: true } } },
    });
    if (!tenant) {
      throw new NotFoundException('租户不存在');
    }
    return tenant;
  }

  async create(data: {
    name: string;
    contactUserId?: number | null;
    contactName: string;
    contactMobile?: string | null;
    status?: CommonStatus;
    website?: string | null;
    packageId?: number | null;
    expireTime: Date | string;
    accountCount?: number;
    username?: string;
    password?: string;
  }) {
    const existing = await this.prisma.tenant.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new BadRequestException('租户名称已存在');
    }

    if (data.packageId) {
      const pkg = await this.prisma.tenantPackage.findUnique({
        where: { id: data.packageId },
      });
      if (!pkg) {
        throw new BadRequestException('关联的租户套餐不存在');
      }
    }

    const { username, password, ...tenantFields } = data;

    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: tenantFields.name,
          contactUserId: tenantFields.contactUserId ?? null,
          contactName: tenantFields.contactName,
          contactMobile: tenantFields.contactMobile ?? null,
          status: tenantFields.status ?? CommonStatus.ENABLE,
          website: tenantFields.website ?? null,
          packageId: tenantFields.packageId ?? null,
          expireTime: new Date(tenantFields.expireTime),
          accountCount: tenantFields.accountCount ?? 100,
        },
      });

      if (username && password) {
        const dupUser = await TenantContext.runIgnore(() =>
          tx.user.findUnique({ where: { username } }),
        );
        if (dupUser) {
          throw new BadRequestException(`管理员用户名 [${username}] 已存在`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = await TenantContext.run(tenant.id, () =>
          tx.user.create({
            data: {
              username,
              password: hashedPassword,
              nickname: tenantFields.contactName,
              mobile: tenantFields.contactMobile ?? null,
              status: CommonStatus.ENABLE,
              tenantId: tenant.id,
            },
          }),
        );

        await tx.tenant.update({
          where: { id: tenant.id },
          data: { contactUserId: adminUser.id },
        });
      }

      return tenant;
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      contactUserId?: number | null;
      contactName?: string;
      contactMobile?: string | null;
      status?: CommonStatus;
      website?: string | null;
      packageId?: number | null;
      expireTime?: Date | string;
      accountCount?: number;
    },
  ) {
    await this.findOne(id);
    if (data.name) {
      const dup = await this.prisma.tenant.findFirst({
        where: { name: data.name, id: { not: id } },
      });
      if (dup) {
        throw new BadRequestException('租户名称已存在');
      }
    }
    if (data.packageId) {
      const pkg = await this.prisma.tenantPackage.findUnique({
        where: { id: data.packageId },
      });
      if (!pkg) {
        throw new BadRequestException('关联的租户套餐不存在');
      }
    }
    const updateData = {
      ...data,
      ...(data.expireTime !== undefined
        ? { expireTime: new Date(data.expireTime) }
        : {}),
    };
    return this.prisma.tenant.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    if (id === 1) {
      throw new BadRequestException('系统默认租户无法删除');
    }
    await this.findOne(id);
    return this.prisma.tenant.delete({ where: { id } });
  }
}
