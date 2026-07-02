import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CategoryResponseSchema = z.object({
  id: z.number().int().describe('分类 ID'),
  name: z.string().describe('分类名称'),
  code: z.string().describe('分类编码'),
  sort: z.number().int().describe('排序'),
  status: z.enum(CommonStatus).describe('状态'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class CategoryResponseDto extends createZodDto(CategoryResponseSchema) {}

export const CategoryListResponseSchema = z.object({
  items: z.array(CategoryResponseSchema).describe('分类数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class CategoryListResponseDto extends createZodDto(CategoryListResponseSchema) {}
