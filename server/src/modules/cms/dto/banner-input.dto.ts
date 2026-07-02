import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateBannerSchema = z.object({
  title: z.string({ error: '轮播图标题不能为空' }).min(1, '轮播图标题不能为空').max(100, '标题不能超过100个字符').describe('轮播图标题'),
  picUrl: z.string({ error: '图片链接不能为空' }).url('图片链接格式不正确').describe('图片访问 URL'),
  url: z.string().url('跳转链接格式不正确').nullable().optional().or(z.literal('')).describe('跳转目标 URL'),
  sort: z.number().int().default(0).describe('显示顺序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateBannerDto extends createZodDto(CreateBannerSchema) {}

export const UpdateBannerSchema = CreateBannerSchema.partial();
export class UpdateBannerDto extends createZodDto(UpdateBannerSchema) {}
