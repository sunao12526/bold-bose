import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// SMS Channel DTOs
export const CreateSmsChannelSchema = z.object({
  code: z.string({ error: '渠道编码不能为空' }).min(1, '渠道编码不能为空').max(50, '渠道编码不能超过50').describe('渠道编码'),
  name: z.string({ error: '渠道名称不能为空' }).min(1, '渠道名称不能为空').max(100, '渠道名称不能超过100').describe('渠道名称'),
  apiKey: z.string({ error: 'API Key 不能为空' }).min(1, 'API Key 不能为空').max(100, 'API Key 不能超过100').describe('API Key / AccessKeyId'),
  apiSecret: z.string({ error: 'API Secret 不能为空' }).min(1, 'API Secret 不能为空').max(100, 'API Secret 不能超过100').describe('API Secret / AccessKeySecret'),
  signature: z.string({ error: '短信签名不能为空' }).min(1, '短信签名不能为空').max(50, '短信签名不能超过50').describe('短信签名'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateSmsChannelDto extends createZodDto(CreateSmsChannelSchema) {}

export const UpdateSmsChannelSchema = CreateSmsChannelSchema.partial();
export class UpdateSmsChannelDto extends createZodDto(UpdateSmsChannelSchema) {}

// SMS Template DTOs
export const CreateSmsTemplateSchema = z.object({
  channelId: z.number().int({ error: '短信渠道 ID 必须为整数' }).describe('短信渠道 ID'),
  code: z.string({ error: '模板编码不能为空' }).min(1, '模板编码不能为空').max(50, '模板编码不能超过50').describe('模板唯一标识编码'),
  name: z.string({ error: '模板名称不能为空' }).min(1, '模板名称不能为空').max(100, '模板名称不能超过100').describe('模板名称'),
  content: z.string({ error: '模板内容不能为空' }).min(1, '模板内容不能为空').max(500, '模板内容不能超过500').describe('模板短信内容 (支持 {param} 占位符)'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateSmsTemplateDto extends createZodDto(CreateSmsTemplateSchema) {}

export const UpdateSmsTemplateSchema = CreateSmsTemplateSchema.partial();
export class UpdateSmsTemplateDto extends createZodDto(UpdateSmsTemplateSchema) {}

export const SendMockSmsSchema = z.object({
  mobile: z.string({ error: '手机号码不能为空' }).min(5, '手机号格式不正确').describe('接收短信的手机号码'),
  params: z.record(z.string(), z.string()).optional().describe('短信参数键值对'),
});
export class SendMockSmsDto extends createZodDto(SendMockSmsSchema) {}

// SMS Code DTOs
export const SendSmsCodeSchema = z.object({
  mobile: z.string({ error: '手机号码不能为空' }).min(5, '手机号格式不正确').describe('手机号码'),
  scene: z.number().int({ error: '场景值必须为整数' }).describe('验证码使用场景 (1: 登录, 2: 注册, 3: 修改手机)'),
});
export class SendSmsCodeDto extends createZodDto(SendSmsCodeSchema) {}

export const VerifySmsCodeSchema = z.object({
  mobile: z.string({ error: '手机号码不能为空' }).min(5, '手机号格式不正确').describe('手机号码'),
  code: z.string({ error: '验证码不能为空' }).min(4, '验证码至少为 4 位字符').max(10, '验证码过长').describe('接收到的短信验证码'),
  scene: z.number().int({ error: '场景值必须为整数' }).describe('验证码使用场景 (1: 登录, 2: 注册, 3: 修改手机)'),
});
export class VerifySmsCodeDto extends createZodDto(VerifySmsCodeSchema) {}
