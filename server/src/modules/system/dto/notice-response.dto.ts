import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const NoticeResponseSchema = z.object({
  id: z.number().int().describe('公告 ID'),
  title: z.string().describe('公告标题'),
  type: z.number().int().describe('公告类型 (1: 通知, 2: 公告)'),
  content: z.string().describe('公告正文内容'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class NoticeResponseDto extends createZodDto(NoticeResponseSchema) {}

export const NoticeListResponseSchema = z.object({
  items: z.array(NoticeResponseSchema).describe('公告数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class NoticeListResponseDto extends createZodDto(NoticeListResponseSchema) {}
