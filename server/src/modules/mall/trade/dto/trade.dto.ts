import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AddCartSchema = z.object({
  skuId: z.coerce.number().int(),
  count: z.coerce.number().int().min(1).max(999).default(1),
});
export class AddCartDto extends createZodDto(AddCartSchema) {}

export const UpdateCartCountSchema = z.object({
  id: z.coerce.number().int(),
  count: z.coerce.number().int().min(1).max(999),
});
export class UpdateCartCountDto extends createZodDto(UpdateCartCountSchema) {}

export const UpdateCartSelectedSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
  selected: z.boolean(),
});
export class UpdateCartSelectedDto extends createZodDto(UpdateCartSelectedSchema) {}

export const SettlementItemSchema = z.object({
  skuId: z.coerce.number().int(),
  count: z.coerce.number().int().min(1).max(999),
});

export const TradeOrderSettlementSchema = z.object({
  items: z.array(SettlementItemSchema).optional(),
  cartIds: z.array(z.coerce.number().int()).optional(),
  couponId: z.coerce.number().int().nullable().optional(),
  deliveryTemplateId: z.coerce.number().int().nullable().optional(),
  addressId: z.coerce.number().int().nullable().optional(),
});
export class TradeOrderSettlementDto extends createZodDto(TradeOrderSettlementSchema) {}

export const CreateTradeOrderSchema = TradeOrderSettlementSchema.extend({
  addressId: z.coerce.number().int({ error: '请选择收货地址' }),
  remark: z.string().max(500).optional(),
});
export class CreateTradeOrderDto extends createZodDto(CreateTradeOrderSchema) {}

export const CreateAfterSaleSchema = z.object({
  orderId: z.coerce.number().int(),
  refundPrice: z.coerce.number().int().min(1).optional(),
  reason: z.string({ error: '退款原因不能为空' }).min(1).max(200),
  userRemark: z.string().max(500).optional(),
});
export class CreateAfterSaleDto extends createZodDto(CreateAfterSaleSchema) {}
