import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// Mail Account DTOs
export const CreateMailAccountSchema = z.object({
  mail: z.string({ error: '邮箱地址不能为空' }).email('邮箱格式不正确').max(100, '邮箱长度不能超过100').describe('邮箱地址'),
  username: z.string({ error: '用户名不能为空' }).min(1, '用户名不能为空').max(100, '用户名长度不能超过100').describe('SMTP 用户名'),
  password: z.string({ error: '密码不能为空' }).min(1, '密码不能为空').max(100, '密码长度不能超过100').describe('SMTP 密码/授权码'),
  host: z.string({ error: 'SMTP 服务器地址不能为空' }).min(1, '服务器地址不能为空').max(100, '服务器地址长度不能超过100').describe('SMTP 服务器域名/IP'),
  port: z.number().int({ error: 'SMTP 端口必须为整数' }).describe('SMTP 端口 (如 465 或 25)'),
  ssl: z.boolean().default(false).describe('是否启用 SSL 传输加密'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
});
export class CreateMailAccountDto extends createZodDto(CreateMailAccountSchema) {}

export const UpdateMailAccountSchema = CreateMailAccountSchema.partial();
export class UpdateMailAccountDto extends createZodDto(UpdateMailAccountSchema) {}

// Mail Template DTOs
export const CreateMailTemplateSchema = z.object({
  accountId: z.number().int({ error: '邮件账号 ID 必须为整数' }).describe('关联的邮件账号 ID'),
  code: z.string({ error: '模板编码不能为空' }).min(1, '模板编码不能为空').max(50, '模板编码长度不能超过50').describe('模板唯一标识编码'),
  name: z.string({ error: '模板名称不能为空' }).min(1, '模板名称不能为空').max(100, '模板名称长度不能超过100').describe('模板名称'),
  title: z.string({ error: '邮件标题不能为空' }).min(1, '邮件标题不能为空').max(200, '邮件标题长度不能超过200').describe('发送时的默认邮件标题'),
  content: z.string({ error: '模板内容不能为空' }).min(1, '模板内容不能为空').describe('邮件 HTML 模板正文内容'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateMailTemplateDto extends createZodDto(CreateMailTemplateSchema) {}

export const UpdateMailTemplateSchema = CreateMailTemplateSchema.partial();
export class UpdateMailTemplateDto extends createZodDto(UpdateMailTemplateSchema) {}

export const SendMockMailSchema = z.object({
  receiver: z.string({ error: '接收邮箱不能为空' }).email('接收邮箱格式不正确').describe('接收测试邮件的目标邮箱地址'),
  params: z.record(z.string(), z.string()).optional().describe('邮件变量模板参数'),
});
export class SendMockMailDto extends createZodDto(SendMockMailSchema) {}
