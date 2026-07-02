import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CmsCommentStatus } from '@prisma/client';

export const CommentResponseSchema = z.object({
  id: z.number().int().describe('评论 ID'),
  articleId: z.number().int().describe('关联的文章 ID'),
  userId: z.number().int().nullable().describe('发表用户 ID (非必有，允许匿名/后台代发)'),
  nickname: z.string().describe('发表用户昵称'),
  content: z.string().describe('评论内容正文'),
  status: z.enum(CmsCommentStatus).describe('审核状态 (PENDING/APPROVED/REJECTED)'),
  createdAt: z.string().describe('评论时间'),
});
export class CommentResponseDto extends createZodDto(CommentResponseSchema) {}

export const CommentListResponseSchema = z.object({
  items: z.array(CommentResponseSchema).describe('评论数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class CommentListResponseDto extends createZodDto(CommentListResponseSchema) {}
