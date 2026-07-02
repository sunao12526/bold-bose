import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CmsArticleStatus } from '@prisma/client';

export const CreateArticleSchema = z.object({
  categoryId: z.number().int({ error: '分类 ID 必须是整数' }).describe('文章分类 ID'),
  title: z.string({ error: '文章标题不能为空' }).min(1, '文章标题不能为空').max(200, '标题不能超过200个字符').describe('文章标题'),
  content: z.string().nullable().optional().describe('文章富文本内容'),
  summary: z.string().max(500).nullable().optional().describe('文章摘要'),
  coverUrl: z.string().nullable().optional().describe('封面图片 URL'),
  author: z.string({ error: '作者名称不能为空' }).min(1, '作者不能为空').max(50, '作者名不能超过50个字符').describe('文章作者名'),
  sortOrder: z.number().int().default(0).describe('显示顺序'),
  status: z.enum(CmsArticleStatus).default('DRAFT').describe('发布状态 (DRAFT/PUBLISHED/ARCHIVED)'),
  isTop: z.boolean().default(false).describe('是否置顶'),
  isRecommend: z.boolean().default(false).describe('是否推荐'),
  tagIds: z.array(z.number().int()).optional().describe('关联的标签 ID 数组'),
});
export class CreateArticleDto extends createZodDto(CreateArticleSchema) {}

export const UpdateArticleSchema = CreateArticleSchema.partial();
export class UpdateArticleDto extends createZodDto(UpdateArticleSchema) {}

export const UpdateArticleStatusSchema = z.object({
  status: z.enum(CmsArticleStatus).describe('目标状态'),
});
export class UpdateArticleStatusDto extends createZodDto(UpdateArticleStatusSchema) {}
