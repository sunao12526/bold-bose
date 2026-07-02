import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateNoticeSchema = z.object({
  title: z.string({ error: '公告标题不能为空' }).min(1, '公告标题不能为空').max(200, '公告标题不能超过200个字符').describe('公告标题'),
  type: z.number().int().describe('公告类型 (1: 通知, 2: 公告)'),
  content: z.string({ error: '公告内容不能为空' }).min(1, '公告内容不能为空').describe('公告正文内容'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
});
export class CreateNoticeDto extends createZodDto(CreateNoticeSchema) {}

export const UpdateNoticeSchema = CreateNoticeSchema.partial();
export class UpdateNoticeDto extends createZodDto(UpdateNoticeSchema) {}
