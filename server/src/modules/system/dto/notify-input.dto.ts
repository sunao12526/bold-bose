import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateNotifyTemplateSchema = z.object({
  name: z.string({ error: '模板名称不能为空' }).min(1, '模板名称不能为空').max(100, '模板名称不能超过100').describe('模板名称'),
  code: z.string({ error: '模板编码不能为空' }).min(1, '模板编码不能为空').max(100, '模板编码不能超过100').describe('模板唯一标识编码'),
  type: z.string({ error: '通知类型不能为空' }).describe('通知渠道类型 (SYSTEM: 站内信, EMAIL, SMS)'),
  title: z.string({ error: '模板标题不能为空' }).min(1, '模板标题不能为空').max(200, '模板标题不能超过200').describe('默认通知标题'),
  content: z.string({ error: '模板内容不能为空' }).min(1, '模板内容不能为空').max(2000, '模板内容不能超过2000').describe('模板正文内容'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateNotifyTemplateDto extends createZodDto(CreateNotifyTemplateSchema) {}

export const UpdateNotifyTemplateSchema = CreateNotifyTemplateSchema.partial();
export class UpdateNotifyTemplateDto extends createZodDto(UpdateNotifyTemplateSchema) {}

export const SendTestNotifySchema = z.object({
  userId: z.number().int({ error: '接收用户 ID 必须为整数' }).describe('接收人的用户 ID'),
  templateCode: z.string({ error: '模板编码不能为空' }).describe('模板唯一标识编码'),
  variables: z.record(z.string(), z.string()).optional().describe('变量参数映射'),
});
export class SendTestNotifyDto extends createZodDto(SendTestNotifySchema) {}
