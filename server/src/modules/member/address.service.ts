import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.memberId) {
      where.memberId = Number(query.memberId);
    }

    if (query?.page || query?.pageSize) {
      const page = Number(query.page || 1);
      const pageSize = Number(query.pageSize || 20);

      const [items, total] = await Promise.all([
        this.prisma.memberAddress.findMany({
          where,
          orderBy: { id: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.prisma.memberAddress.count({ where }),
      ]);
      return { items, total };
    }

    const items = await this.prisma.memberAddress.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { items, total: items.length };
  }

  async findOne(id: number) {
    const address = await this.prisma.memberAddress.findUnique({
      where: { id },
    });
    if (!address) throw new NotFoundException('会员收货地址不存在');
    return address;
  }

  async create(data: any) {
    // Check member exists
    const member = await this.prisma.memberUser.findUnique({
      where: { id: Number(data.memberId) },
    });
    if (!member) throw new NotFoundException('会员不存在');

    return this.prisma.$transaction(async (tx) => {
      const defaultStatus = !!data.defaultStatus;

      // If this is set to default, set all other addresses of this member to false
      if (defaultStatus) {
        await tx.memberAddress.updateMany({
          where: { memberId: Number(data.memberId) },
          data: { defaultStatus: false },
        });
      }

      return tx.memberAddress.create({
        data: {
          memberId: Number(data.memberId),
          name: data.name,
          mobile: data.mobile,
          areaId: data.areaId ? Number(data.areaId) : null,
          detailAddress: data.detailAddress,
          defaultStatus,
        },
      });
    });
  }

  async update(id: number, data: any) {
    const address = await this.findOne(id);
    const defaultStatus = data.defaultStatus !== undefined ? !!data.defaultStatus : address.defaultStatus;

    return this.prisma.$transaction(async (tx) => {
      if (defaultStatus && !address.defaultStatus) {
        await tx.memberAddress.updateMany({
          where: { memberId: address.memberId },
          data: { defaultStatus: false },
        });
      }

      return tx.memberAddress.update({
        where: { id },
        data: {
          name: data.name,
          mobile: data.mobile,
          areaId: data.areaId !== undefined ? (data.areaId ? Number(data.areaId) : null) : undefined,
          detailAddress: data.detailAddress,
          defaultStatus,
        },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.memberAddress.delete({
      where: { id },
    });
  }
}
