import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// Mail Account Response
export const MailAccountResponseSchema = z.object({
  id: z.number().int().describe('邮箱账号 ID'),
  mail: z.string().describe('邮箱地址'),
  username: z.string().describe('SMTP 用户名'),
  password: z.string().describe('SMTP 密码/授权码'),
  host: z.string().describe('SMTP 服务器地址'),
  port: z.number().int().describe('SMTP 端口'),
  ssl: z.boolean().describe('是否启用 SSL'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MailAccountResponseDto extends createZodDto(MailAccountResponseSchema) {}

export const MailAccountListResponseSchema = z.object({
  items: z.array(MailAccountResponseSchema).describe('邮件账号列表'),
  total: z.number().int().describe('总记录数'),
});
export class MailAccountListResponseDto extends createZodDto(MailAccountListResponseSchema) {}

// Mail Template Response
export const MailTemplateResponseSchema = z.object({
  id: z.number().int().describe('模板 ID'),
  accountId: z.number().int().describe('邮件账号 ID'),
  code: z.string().describe('模板编码'),
  name: z.string().describe('模板名称'),
  title: z.string().describe('邮件标题'),
  content: z.string().describe('模板正文 HTML'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MailTemplateResponseDto extends createZodDto(MailTemplateResponseSchema) {}

export const MailTemplateListResponseSchema = z.object({
  items: z.array(MailTemplateResponseSchema).describe('邮件模板列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class MailTemplateListResponseDto extends createZodDto(MailTemplateListResponseSchema) {}

// Mail Log Response
export const MailLogResponseSchema = z.object({
  id: z.number().int().describe('日志 ID'),
  templateId: z.number().int().describe('模板 ID'),
  receiver: z.string().describe('接收人邮箱'),
  title: z.string().describe('邮件标题'),
  content: z.string().describe('发送的邮件正文'),
  status: z.string().describe('发送状态 (SUCCESS/FAIL)'),
  errorMessage: z.string().nullable().describe('错误信息'),
  sendTime: z.string().describe('发送时间'),
});
export class MailLogResponseDto extends createZodDto(MailLogResponseSchema) {}

export const MailLogListResponseSchema = z.object({
  items: z.array(MailLogResponseSchema).describe('邮件日志列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class MailLogListResponseDto extends createZodDto(MailLogListResponseSchema) {}
