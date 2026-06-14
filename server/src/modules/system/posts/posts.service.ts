import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.post.create({ data });
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

    return this.prisma.post.findMany({
      where,
      orderBy: { sort: 'asc' },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.post.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('数据记录不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.post.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.post.delete({ where: { id } });
  }
}
