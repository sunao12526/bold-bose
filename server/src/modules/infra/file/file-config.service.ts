import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { FileClient } from './client/file-client.interface';
import { LocalFileClient } from './client/local-file-client';
import { S3FileClient } from './client/s3-file-client';

@Injectable()
export class FileConfigService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const config = await this.prisma.fileConfig.create({ data });
    if (data.master) {
      await this.setMaster(config.id);
    }
    return config;
  }

  async findAll() {
    return this.prisma.fileConfig.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const config = await this.prisma.fileConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException('文件配置不存在');
    return config;
  }

  async update(id: number, data: any) {
    const config = await this.prisma.fileConfig.update({
      where: { id },
      data,
    });
    if (data.master) {
      await this.setMaster(id);
    }
    return config;
  }

  async remove(id: number) {
    const config = await this.findOne(id);
    if (config.master) {
      throw new Error('默认主配置无法删除');
    }
    return this.prisma.fileConfig.delete({ where: { id } });
  }

  async setMaster(id: number) {
    await this.prisma.fileConfig.updateMany({
      where: { id: { not: id } },
      data: { master: false },
    });
    return this.prisma.fileConfig.update({
      where: { id },
      data: { master: true },
    });
  }

  async getMasterClient(): Promise<{ client: FileClient; configId: number }> {
    const config = await this.prisma.fileConfig.findFirst({
      where: { master: true },
    });
    if (!config) {
      throw new Error('未找到主文件配置');
    }

    const c = config.config as any;
    if (config.storage === 'LOCAL') {
      return {
        client: new LocalFileClient({
          baseFolder: c.baseFolder,
          domain: c.domain,
        }),
        configId: config.id,
      };
    } else if (config.storage === 'S3') {
      return {
        client: new S3FileClient({
          endpoint: c.endpoint,
          bucket: c.bucket,
          accessKey: c.accessKey,
          secretKey: c.secretKey,
          domain: c.domain,
        }),
        configId: config.id,
      };
    }
    throw new Error('不支持的存储类型');
  }
}
