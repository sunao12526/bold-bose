import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreatePayAppSchema = z.object({
  name: z.string({ error: '应用名称不能为空' }).min(1, '应用名称不能为空').max(64, '应用名称不能超过64个字符').describe('支付应用名称'),
  code: z.string({ error: '应用编码不能为空' }).min(1, '应用编码不能为空').max(64, '应用编码不能超过64个字符').describe('应用唯一编码'),
  status: z.enum(CommonStatus).default('ENABLE').describe('启用状态'),
  remark: z.string().optional().describe('备注说明'),
});
export class CreatePayAppDto extends createZodDto(CreatePayAppSchema) {}

export const UpdatePayAppSchema = CreatePayAppSchema.partial();
export class UpdatePayAppDto extends createZodDto(UpdatePayAppSchema) {}

export const CreatePayChannelSchema = z.object({
  appId: z.number().int({ error: '应用 ID 必须是整数' }).describe('关联的支付应用 ID'),
  code: z.string({ error: '通道编码不能为空' }).min(1, '通道编码不能为空').max(32, '通道编码不能超过32').describe('支付通道编码 (e.g. alipay, wechat, mock)'),
  config: z.any().describe('通道参数配置 JSON 数据'),
  status: z.enum(CommonStatus).default('ENABLE').describe('启用状态'),
  remark: z.string().optional().describe('备注说明'),
});
export class CreatePayChannelDto extends createZodDto(CreatePayChannelSchema) {}

export const SubmitPayOrderSchema = z.object({
  channelCode: z.string({ error: '支付通道编码不能为空' }).min(1, '通道编码不能为空').describe('支付通道编码'),
});
export class SubmitPayOrderDto extends createZodDto(SubmitPayOrderSchema) {}
