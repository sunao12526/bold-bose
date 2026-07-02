import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const NotifyTemplateResponseSchema = z.object({
  id: z.number().int().describe('模板 ID'),
  name: z.string().describe('模板名称'),
  code: z.string().describe('模板唯一标识编码'),
  type: z.string().describe('通知类型'),
  title: z.string().describe('模板标题'),
  content: z.string().describe('模板内容'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class NotifyTemplateResponseDto extends createZodDto(NotifyTemplateResponseSchema) {}

export const NotifyMessageResponseSchema = z.object({
  id: z.number().int().describe('消息 ID'),
  templateId: z.number().int().describe('模板 ID'),
  templateCode: z.string().describe('模板编码'),
  userId: z.number().int().describe('用户 ID'),
  username: z.string().describe('用户名'),
  title: z.string().describe('通知标题'),
  content: z.string().describe('通知内容'),
  read: z.boolean().describe('是否已读'),
  readTime: z.string().nullable().describe('阅读时间'),
  status: z.number().int().describe('消息状态 (200: 成功, 500: 失败)'),
  errorMessage: z.string().nullable().describe('失败原因'),
  createdAt: z.string().describe('接收时间'),
});
export class NotifyMessageResponseDto extends createZodDto(NotifyMessageResponseSchema) {}
