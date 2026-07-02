import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// SMS Channel Response
export const SmsChannelResponseSchema = z.object({
  id: z.number().int().describe('渠道 ID'),
  code: z.string().describe('渠道编码'),
  name: z.string().describe('渠道名称'),
  apiKey: z.string().describe('API Key'),
  apiSecret: z.string().describe('API Secret'),
  signature: z.string().describe('签名'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class SmsChannelResponseDto extends createZodDto(SmsChannelResponseSchema) {}

export const SmsChannelListResponseSchema = z.object({
  items: z.array(SmsChannelResponseSchema).describe('短信渠道列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class SmsChannelListResponseDto extends createZodDto(SmsChannelListResponseSchema) {}

// SMS Template Response
export const SmsTemplateResponseSchema = z.object({
  id: z.number().int().describe('模板 ID'),
  channelId: z.number().int().describe('渠道 ID'),
  code: z.string().describe('模板编码'),
  name: z.string().describe('模板名称'),
  content: z.string().describe('模板内容'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class SmsTemplateResponseDto extends createZodDto(SmsTemplateResponseSchema) {}

export const SmsTemplateListResponseSchema = z.object({
  items: z.array(SmsTemplateResponseSchema).describe('短信模板列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class SmsTemplateListResponseDto extends createZodDto(SmsTemplateListResponseSchema) {}

// SMS Log Response
export const SmsLogResponseSchema = z.object({
  id: z.number().int().describe('日志 ID'),
  templateId: z.number().int().describe('模板 ID'),
  mobile: z.string().describe('接收手机号'),
  content: z.string().describe('短信内容'),
  status: z.string().describe('状态 (SUCCESS/FAIL)'),
  errorMessage: z.string().nullable().describe('错误原因'),
  sendTime: z.string().describe('发送时间'),
});
export class SmsLogResponseDto extends createZodDto(SmsLogResponseSchema) {}

export const SmsLogListResponseSchema = z.object({
  items: z.array(SmsLogResponseSchema).describe('短信日志列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class SmsLogListResponseDto extends createZodDto(SmsLogListResponseSchema) {}

// SMS Code Response
export const SmsCodeResponseSchema = z.object({
  id: z.number().int().describe('记录 ID'),
  mobile: z.string().describe('手机号码'),
  code: z.string().describe('验证码'),
  scene: z.number().int().describe('场景值'),
  todayIndex: z.number().int().describe('今日发送序号'),
  used: z.boolean().describe('是否已使用'),
  usedIp: z.string().nullable().describe('使用时的 IP'),
  usedTime: z.string().nullable().describe('使用时间'),
  createdAt: z.string().describe('创建时间'),
  expiredAt: z.string().describe('过期时间'),
});
export class SmsCodeResponseDto extends createZodDto(SmsCodeResponseSchema) {}

export const SmsCodeListResponseSchema = z.object({
  items: z.array(SmsCodeResponseSchema).describe('短信验证码列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class SmsCodeListResponseDto extends createZodDto(SmsCodeListResponseSchema) {}

export const SendSmsCodeResponseSchema = z.object({
  success: z.boolean().describe('是否成功'),
  expiredAt: z.string().describe('过期时间'),
});
export class SendSmsCodeResponseDto extends createZodDto(SendSmsCodeResponseSchema) {}
