import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const existing = await this.prisma.sysConfig.findUnique({
      where: { key: data.key },
    });
    if (existing) throw new BadRequestException('配置键名已存在');
    return this.prisma.sysConfig.create({ data });
  }

  async findAll() {
    return this.prisma.sysConfig.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const config = await this.prisma.sysConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('配置项不存在');
    return config;
  }

  async findByKey(key: string) {
    const config = await this.prisma.sysConfig.findUnique({ where: { key } });
    if (!config) throw new NotFoundException(`配置键名 ${key} 不存在`);
    return config;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    if (data.key) {
      const existing = await this.prisma.sysConfig.findFirst({
        where: { key: data.key, id: { not: id } },
      });
      if (existing) throw new BadRequestException('配置键名已存在');
    }
    return this.prisma.sysConfig.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sysConfig.delete({ where: { id } });
  }
}
