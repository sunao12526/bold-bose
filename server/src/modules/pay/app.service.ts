import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class PayAppService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; code: string; status?: CommonStatus; remark?: string }) {
    const existing = await this.prisma.payApp.findUnique({ where: { code: data.code } });
    if (existing) {
      throw new BadRequestException('应用编码已存在');
    }
    return this.prisma.payApp.create({ data });
  }

  async findAll() {
    return this.prisma.payApp.findMany({
      include: {
        channels: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const app = await this.prisma.payApp.findUnique({
      where: { id },
      include: {
        channels: true,
      },
    });
    if (!app) throw new NotFoundException('支付应用不存在');
    return app;
  }

  async findByCode(code: string) {
    const app = await this.prisma.payApp.findUnique({
      where: { code },
    });
    if (!app) throw new NotFoundException('支付应用不存在');
    return app;
  }

  async update(id: number, data: { name?: string; code?: string; status?: CommonStatus; remark?: string }) {
    await this.findOne(id);
    if (data.code) {
      const existing = await this.prisma.payApp.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (existing) {
        throw new BadRequestException('应用编码已存在');
      }
    }
    return this.prisma.payApp.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.payApp.delete({ where: { id } });
  }
}
