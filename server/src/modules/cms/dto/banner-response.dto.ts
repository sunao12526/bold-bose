import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const BannerResponseSchema = z.object({
  id: z.number().int().describe('轮播图 ID'),
  title: z.string().describe('轮播图标题'),
  picUrl: z.string().describe('图片访问 URL'),
  url: z.string().nullable().describe('点击跳转 URL'),
  sort: z.number().int().describe('显示顺序'),
  status: z.enum(CommonStatus).describe('状态'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class BannerResponseDto extends createZodDto(BannerResponseSchema) {}

export const BannerListResponseSchema = z.object({
  items: z.array(BannerResponseSchema).describe('轮播图数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class BannerListResponseDto extends createZodDto(BannerListResponseSchema) {}
