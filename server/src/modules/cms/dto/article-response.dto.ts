import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CmsArticleStatus } from '@prisma/client';

export const ArticleResponseSchema = z.object({
  id: z.number().int().describe('文章 ID'),
  categoryId: z.number().int().describe('分类 ID'),
  title: z.string().describe('文章标题'),
  content: z.string().nullable().describe('文章内容'),
  summary: z.string().nullable().describe('文章摘要'),
  coverUrl: z.string().nullable().describe('封面图 URL'),
  author: z.string().describe('作者名称'),
  viewCount: z.number().int().describe('浏览次数'),
  likeCount: z.number().int().describe('点赞次数'),
  sortOrder: z.number().int().describe('排序值'),
  status: z.enum(CmsArticleStatus).describe('发布状态'),
  isTop: z.boolean().describe('是否置顶'),
  isRecommend: z.boolean().describe('是否推荐'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class ArticleResponseDto extends createZodDto(ArticleResponseSchema) {}

export const ArticleListResponseSchema = z.object({
  items: z.array(ArticleResponseSchema).describe('文章数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class ArticleListResponseDto extends createZodDto(ArticleListResponseSchema) {}
