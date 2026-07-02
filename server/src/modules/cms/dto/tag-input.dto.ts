import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateTagSchema = z.object({
  name: z.string({ error: '标签名称不能为空' }).min(1, '标签名称不能为空').max(50, '标签名称不能超过50个字符').describe('标签名称'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
});
export class CreateTagDto extends createZodDto(CreateTagSchema) {}

export const UpdateTagSchema = CreateTagSchema.partial();
export class UpdateTagDto extends createZodDto(UpdateTagSchema) {}
