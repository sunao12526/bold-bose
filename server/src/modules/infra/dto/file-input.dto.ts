import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { FileStorageType } from '@prisma/client';

export const CreateFileConfigSchema = z.object({
  name: z.string({ error: '配置名称不能为空' }).min(1, '配置名称不能为空').max(100, '配置名称不能超过100').describe('配置名称'),
  storage: z.enum(FileStorageType).default('LOCAL').describe('存储类型 (LOCAL/S3)'),
  config: z.record(z.string(), z.any()).describe('配置参数 JSON'),
  master: z.boolean().default(false).describe('是否为主配置'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateFileConfigDto extends createZodDto(CreateFileConfigSchema) {}

export const UpdateFileConfigSchema = CreateFileConfigSchema.partial();
export class UpdateFileConfigDto extends createZodDto(UpdateFileConfigSchema) {}
