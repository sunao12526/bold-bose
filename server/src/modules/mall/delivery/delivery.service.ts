import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

export interface DeliveryTemplateRate {
  basePrice: number;
  extraPrice: number;
  freePrice?: number | null;
}

export function calculateDeliveryPrice(
  template: DeliveryTemplateRate | null | undefined,
  totalCount: number,
  totalPrice: number,
): number {
  if (!template || totalCount <= 0) {
    return 0;
  }
  if (
    template.freePrice !== undefined &&
    template.freePrice !== null &&
    totalPrice >= template.freePrice
  ) {
    return 0;
  }
  return (
    Math.max(0, template.basePrice) +
    Math.max(0, totalCount - 1) * Math.max(0, template.extraPrice)
  );
}

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= Express Companies =================

  async findAllExpress(query?: {
    page?: number | string;
    pageSize?: number | string;
    name?: string;
    code?: string;
    status?: CommonStatus;
  }) {
    const where: any = {};
    if (query?.name) where.name = { contains: query.name };
    if (query?.code) where.code = { contains: query.code };
    if (query?.status) where.status = query.status;

    return paginateQuery(this.prisma, 'mallDeliveryExpress', query || {}, {
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }],
    });
  }

  async findSimpleExpressList() {
    return this.prisma.mallDeliveryExpress.findMany({
      where: { status: CommonStatus.ENABLE },
      select: { id: true, code: true, name: true },
      orderBy: { sort: 'asc' },
    });
  }

  async createExpress(data: {
    code: string;
    name: string;
    logo?: string | null;
    sort?: number;
    status?: CommonStatus;
  }) {
    const existing = await this.prisma.mallDeliveryExpress.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new BadRequestException(`物流编码 [${data.code}] 已存在`);
    }
    return this.prisma.mallDeliveryExpress.create({ data });
  }

  async updateExpress(id: number, data: any) {
    const existing = await this.prisma.mallDeliveryExpress.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('物流公司不存在');
    return this.prisma.mallDeliveryExpress.update({ where: { id }, data });
  }

  async removeExpress(id: number) {
    const existing = await this.prisma.mallDeliveryExpress.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('物流公司不存在');
    return this.prisma.mallDeliveryExpress.delete({ where: { id } });
  }

  // ================= Delivery Templates =================

  async findAllTemplates(query?: {
    page?: number | string;
    pageSize?: number | string;
    name?: string;
    status?: CommonStatus;
  }) {
    const where: any = {};
    if (query?.name) where.name = { contains: query.name };
    if (query?.status) where.status = query.status;

    return paginateQuery(
      this.prisma,
      'mallDeliveryExpressTemplate',
      query || {},
      {
        where,
        orderBy: [{ sort: 'asc' }, { id: 'desc' }],
      },
    );
  }

  async findTemplateById(id?: number) {
    if (id) {
      return this.prisma.mallDeliveryExpressTemplate.findFirst({
        where: { id, status: CommonStatus.ENABLE },
      });
    }
    return this.prisma.mallDeliveryExpressTemplate.findFirst({
      where: { status: CommonStatus.ENABLE },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });
  }

  async createTemplate(data: {
    name: string;
    chargeMode?: number;
    sort?: number;
    basePrice: number;
    extraPrice: number;
    freePrice?: number | null;
    status?: CommonStatus;
  }) {
    return this.prisma.mallDeliveryExpressTemplate.create({ data });
  }

  async updateTemplate(id: number, data: any) {
    const existing = await this.prisma.mallDeliveryExpressTemplate.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('运费模板不存在');
    return this.prisma.mallDeliveryExpressTemplate.update({
      where: { id },
      data,
    });
  }

  async removeTemplate(id: number) {
    const existing = await this.prisma.mallDeliveryExpressTemplate.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('运费模板不存在');
    return this.prisma.mallDeliveryExpressTemplate.delete({ where: { id } });
  }
}
