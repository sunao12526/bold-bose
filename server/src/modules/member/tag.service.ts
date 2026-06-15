import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.memberTag.findUnique({
      where: { name: data.name },
    });
    if (existing) {
      throw new BadRequestException(`标签名称 [${data.name}] 已存在`);
    }

    return this.prisma.memberTag.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || CommonStatus.ENABLE,
      },
    });
  }

  async findAll() {
    return this.prisma.memberTag.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const tag = await this.prisma.memberTag.findUnique({
      where: { id },
    });
    if (!tag) throw new NotFoundException('会员标签不存在');
    return tag;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    if (data.name !== undefined) {
      const existing = await this.prisma.memberTag.findFirst({
        where: {
          name: data.name,
          id: { not: id },
        },
      });
      if (existing) {
        throw new BadRequestException(`标签名称 [${data.name}] 已存在`);
      }
    }

    return this.prisma.memberTag.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.memberTag.delete({
      where: { id },
    });
  }
}
