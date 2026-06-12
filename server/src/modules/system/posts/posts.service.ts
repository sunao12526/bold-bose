import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return (this.prisma as any).posts.create({ data });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.title) {
      where.title = query.title;
    }
    if (query?.content) {
      where.content = query.content;
    }
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.created_at) {
      where.created_at = query.created_at;
    }

    return (this.prisma as any).posts.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const record = await (this.prisma as any).posts.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('数据记录不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return (this.prisma as any).posts.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return (this.prisma as any).posts.delete({ where: { id } });
  }
}
