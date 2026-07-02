import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const PostsResponseSchema = z.object({
  id: z.number().int().describe('岗位 ID'),
  name: z.string().describe('岗位名称'),
  code: z.string().describe('岗位编码'),
  sort: z.number().int().describe('显示顺序'),
  remark: z.string().nullable().describe('备注'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  createdAt: z.string().describe('创建时间'),
});
export class PostsResponseDto extends createZodDto(PostsResponseSchema) {}

export const PostsListResponseSchema = z.object({
  items: z.array(PostsResponseSchema).describe('岗位数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class PostsListResponseDto extends createZodDto(PostsListResponseSchema) {}
