import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus, PayOrderStatus, PayRefundStatus, PayNotifyStatus } from '@prisma/client';

export const PayAppResponseSchema = z.object({
  id: z.number().int().describe('应用自增 ID'),
  name: z.string().describe('应用名称'),
  code: z.string().describe('应用编码'),
  status: z.enum(CommonStatus).describe('启用状态'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class PayAppResponseDto extends createZodDto(PayAppResponseSchema) {}

export const PayChannelResponseSchema = z.object({
  id: z.number().int().describe('通道自增 ID'),
  appId: z.number().int().describe('关联的应用 ID'),
  code: z.string().describe('通道编码'),
  config: z.any().describe('通道具体参数配置 JSON'),
  status: z.enum(CommonStatus).describe('启用状态'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class PayChannelResponseDto extends createZodDto(PayChannelResponseSchema) {}

export const PayOrderResponseSchema = z.object({
  id: z.number().int().describe('支付订单 ID'),
  appId: z.number().int().describe('应用 ID'),
  merchantOrderId: z.string().describe('商户平台订单号'),
  subject: z.string().describe('商品购买主题描述'),
  price: z.number().int().describe('支付金额 (分)'),
  channelCode: z.string().nullable().describe('所选支付通道编码'),
  status: z.enum(PayOrderStatus).describe('订单支付状态 (UNPAID/SUCCESS/CLOSED)'),
  payTime: z.string().nullable().describe('订单支付成功时间'),
  expireTime: z.string().describe('支付失效截止时间'),
  merchantNotifyUrl: z.string().describe('商户通知回调 Url'),
  notifyStatus: z.enum(PayNotifyStatus).describe('商户端通知接收状态'),
});
export class PayOrderResponseDto extends createZodDto(PayOrderResponseSchema) {}

export const PayRefundResponseSchema = z.object({
  id: z.number().int().describe('退款订单 ID'),
  appId: z.number().int().describe('应用 ID'),
  payOrderId: z.number().int().describe('原支付订单 ID'),
  merchantRefundId: z.string().describe('商户平台退款号'),
  price: z.number().int().describe('原订单总金额 (分)'),
  refundPrice: z.number().int().describe('本次退款金额 (分)'),
  status: z.enum(PayRefundStatus).describe('退款订单处理状态 (APPLY/SUCCESS/CLOSED/FAIL)'),
  reason: z.string().describe('退款申请原因描述'),
  refundTime: z.string().nullable().describe('退款成功执行时间'),
  merchantNotifyUrl: z.string().describe('商户回调通知 Url'),
  notifyStatus: z.enum(PayNotifyStatus).describe('通知商户退款结果状态'),
});
export class PayRefundResponseDto extends createZodDto(PayRefundResponseSchema) {}

export const PayOrderSubmitResultSchema = z.object({
  success: z.boolean().describe('是否提交成功'),
  displayMode: z.string().describe('展示模式 (e.g. url, qrCode, mock)'),
  displayContent: z.string().describe('展示内容 (如支付 URL 或二维码 base64)'),
});
export class PayOrderSubmitResultDto extends createZodDto(PayOrderSubmitResultSchema) {}
