import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class NoticeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.notice.create({
      data: {
        title: data.title,
        type: Number(data.type),
        content: data.content,
        status: data.status || 'ENABLE',
      },
    });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.title) {
      where.title = { contains: query.title };
    }
    if (query?.type) {
      where.type = Number(query.type);
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.notice.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.notice.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('公告不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.notice.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type !== undefined ? Number(data.type) : undefined,
        content: data.content,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.notice.delete({ where: { id } });
  }
}
