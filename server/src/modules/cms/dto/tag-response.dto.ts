import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const TagResponseSchema = z.object({
  id: z.number().int().describe('标签 ID'),
  name: z.string().describe('标签名称'),
  status: z.enum(CommonStatus).describe('状态'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class TagResponseDto extends createZodDto(TagResponseSchema) {}

export const TagListResponseSchema = z.object({
  items: z.array(TagResponseSchema).describe('标签数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class TagListResponseDto extends createZodDto(TagListResponseSchema) {}
