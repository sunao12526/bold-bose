import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreatePostsSchema = z.object({
  name: z.string({ error: '岗位名称不能为空' }).min(1, '岗位名称不能为空').max(100, '岗位名称不能超过100个字符').describe('岗位名称'),
  code: z.string({ error: '岗位编码不能为空' }).min(1, '岗位编码不能为空').max(100, '岗位编码不能超过100个字符').describe('岗位编码'),
  sort: z.number().int({ error: '显示顺序必须为整数' }).describe('显示顺序'),
  remark: z.string().nullable().optional().describe('备注'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
});
export class CreatePostsDto extends createZodDto(CreatePostsSchema) {}

export const UpdatePostsSchema = CreatePostsSchema.partial();
export class UpdatePostsDto extends createZodDto(UpdatePostsSchema) {}
