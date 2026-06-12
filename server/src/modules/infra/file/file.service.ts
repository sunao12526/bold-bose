import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { FileConfigService } from './file-config.service';
import { LocalFileClient } from './client/local-file-client';
import { S3FileClient } from './client/s3-file-client';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private fileConfigService: FileConfigService,
  ) {}

  async upload(file: Express.Multer.File): Promise<any> {
    const { client, configId } = await this.fileConfigService.getMasterClient();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uuid = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    const filePath = `${year}/${month}/${day}/${uuid}${ext}`;

    const fileUrl = await client.upload(file.buffer, filePath, file.mimetype);

    const fileRecord = await this.prisma.file.create({
      data: {
        configId,
        name: file.originalname,
        path: filePath,
        url: fileUrl,
        type: file.mimetype,
        size: file.size,
      },
    });

    return fileRecord;
  }

  async findAll() {
    return this.prisma.file.findMany({
      orderBy: { createdAt: 'desc' },
      include: { config: { select: { name: true, storage: true } } },
    });
  }

  async findOne(id: number) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('文件记录不存在');
    return file;
  }

  async remove(id: number) {
    const file = await this.findOne(id);
    const config = await this.prisma.fileConfig.findUnique({ where: { id: file.configId } });
    
    if (config) {
      const c = config.config as any;
      const client = config.storage === 'LOCAL' 
        ? new LocalFileClient({ baseFolder: c.baseFolder, domain: c.domain })
        : new S3FileClient({ endpoint: c.endpoint, bucket: c.bucket, accessKey: c.accessKey, secretKey: c.secretKey, domain: c.domain });
      
      try {
        await client.delete(file.path);
      } catch (err) {
        console.error('Failed to delete file from storage provider:', err);
      }
    }

    return this.prisma.file.delete({ where: { id } });
  }
}
