import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateCategorySchema = z.object({
  name: z.string({ error: '分类名称不能为空' }).min(1, '分类名称不能为空').max(50, '分类名称不能超过50个字符').describe('分类名称'),
  code: z.string({ error: '分类编码不能为空' }).min(1, '分类编码不能为空').max(50, '分类编码不能超过50个字符').describe('分类编码'),
  sort: z.number().int().default(0).describe('排序值'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

export const UpdateCategorySchema = CreateCategorySchema.partial();
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
