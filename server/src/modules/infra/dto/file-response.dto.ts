import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { FileStorageType } from '@prisma/client';

export const FileConfigResponseSchema = z.object({
  id: z.number().int().describe('配置自增 ID'),
  name: z.string().describe('配置名称'),
  storage: z.enum(FileStorageType).describe('存储类型'),
  config: z.any().describe('配置参数'),
  master: z.boolean().describe('是否为主配置'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class FileConfigResponseDto extends createZodDto(FileConfigResponseSchema) {}

export const FileResponseSchema = z.object({
  id: z.number().int().describe('文件自增 ID'),
  configId: z.number().int().describe('所用的存储配置 ID'),
  name: z.string().describe('文件名'),
  path: z.string().describe('存储路径'),
  url: z.string().describe('访问链接'),
  type: z.string().nullable().describe('MIME 类型'),
  size: z.number().int().describe('文件大小 (字节)'),
  createdAt: z.string().describe('上传时间'),
});
export class FileResponseDto extends createZodDto(FileResponseSchema) {}
