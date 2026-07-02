import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus, MallCouponType, MallCouponScopeType, MallCouponValidityType } from '@prisma/client';

// MallCategory
export const CreateMallCategorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(100).describe('分类名称'),
  parentId: z.number().int().nullable().optional().describe('父分类 ID'),
  picUrl: z.string().max(512).nullable().optional().describe('分类图标 / 图片 URL'),
  sort: z.number().int().default(0).describe('排序排序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('启用状态'),
  remark: z.string().max(500).optional().describe('备注说明'),
});
export class CreateMallCategoryDto extends createZodDto(CreateMallCategorySchema) {}

export const UpdateMallCategorySchema = CreateMallCategorySchema.partial();
export class UpdateMallCategoryDto extends createZodDto(UpdateMallCategorySchema) {}

// MallBrand
export const CreateMallBrandSchema = z.object({
  name: z.string().min(1, '品牌名称不能为空').max(100).describe('品牌名称'),
  logo: z.string().max(512).nullable().optional().describe('品牌 LOGO 图片 URL'),
  sort: z.number().int().default(0).describe('排序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('启用状态'),
  remark: z.string().max(500).optional().describe('备注'),
});
export class CreateMallBrandDto extends createZodDto(CreateMallBrandSchema) {}

export const UpdateMallBrandSchema = CreateMallBrandSchema.partial();
export class UpdateMallBrandDto extends createZodDto(UpdateMallBrandSchema) {}

// MallProperty
export const CreateMallPropertySchema = z.object({
  name: z.string().min(1, '规格名称不能为空').max(100).describe('规格属性名称'),
  remark: z.string().max(500).optional().describe('备注'),
});
export class CreateMallPropertyDto extends createZodDto(CreateMallPropertySchema) {}

export const UpdateMallPropertySchema = CreateMallPropertySchema.partial();
export class UpdateMallPropertyDto extends createZodDto(UpdateMallPropertySchema) {}

// MallPropertyValue
export const CreateMallPropertyValueSchema = z.object({
  propertyId: z.number().int().describe('规格属性 ID'),
  value: z.string().min(1, '规格值不能为空').max(100).describe('规格属性对应的值'),
  remark: z.string().max(500).optional().describe('备注'),
});
export class CreateMallPropertyValueDto extends createZodDto(CreateMallPropertyValueSchema) {}

export const UpdateMallPropertyValueSchema = CreateMallPropertyValueSchema.partial();
export class UpdateMallPropertyValueDto extends createZodDto(UpdateMallPropertyValueSchema) {}

// MallCoupon (Promotion)
export const CreateMallCouponSchema = z.object({
  name: z.string().min(1, '优惠券名称不能为空').max(100).describe('优惠券名称'),
  type: z.enum(MallCouponType).default('CASH').describe('优惠券类型 (CASH: 代金券, DISCOUNT: 折扣券)'),
  minPrice: z.number().int().default(0).describe('满减门槛金额 (分)'),
  value: z.number().int().min(1, '优惠券面值/折扣必须大于 0').describe('面值 (分) 或折扣百分比 (例如 80 代表 8 折)'),
  totalCount: z.number().int().default(0).describe('发放总数量 (0 表示不限制)'),
  scopeType: z.enum(MallCouponScopeType).default('ALL').describe('适用范围 (ALL: 全场通用, CATEGORY: 指定分类, SPU: 指定商品)'),
  scopeValue: z.any().nullable().optional().describe('适用范围的 ID 列表 (JSON 数组)'),
  validityType: z.enum(MallCouponValidityType).default('DATE').describe('有效期类型 (DATE: 固定日期, TERM: 领券后天数)'),
  validStartTime: z.string().nullable().optional().describe('有效开始时间'),
  validEndTime: z.string().nullable().optional().describe('有效结束时间'),
  validDays: z.number().int().nullable().optional().describe('有效天数 (领券后生效天数)'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态'),
});
export class CreateMallCouponDto extends createZodDto(CreateMallCouponSchema) {}

export const UpdateMallCouponStatusSchema = z.object({
  status: z.enum(CommonStatus).describe('优惠券模板启用状态'),
});
export class UpdateMallCouponStatusDto extends createZodDto(UpdateMallCouponStatusSchema) {}

export const SendCouponDtoSchema = z.object({
  memberIds: z.array(z.number().int()).min(1, '目标会员 ID 列表不能为空').describe('会员 ID 列表'),
});
export class SendCouponDto extends createZodDto(SendCouponDtoSchema) {}

// MallOrder AdjustPrice
export const AdjustOrderPriceSchema = z.object({
  discountPrice: z.number().int().describe('折扣调减金额 (分)'),
  payPrice: z.number().int().describe('最终应付总价 (分)'),
});
export class AdjustOrderPriceDto extends createZodDto(AdjustOrderPriceSchema) {}

// MallOrder Ship
export const ShipOrderSchema = z.object({
  logisticsCo: z.string().min(1, '物流公司名称不能为空').describe('物流公司简称 / 名称'),
  logisticsNo: z.string().min(1, '快递单号不能为空').describe('快递包裹追踪单号'),
});
export class ShipOrderDto extends createZodDto(ShipOrderSchema) {}

// Refund Audit
export const RefundAuditSchema = z.object({
  auditRemark: z.string().optional().describe('审核备注说明'),
});
export class RefundAuditDto extends createZodDto(RefundAuditSchema) {}

export const RefundRejectSchema = z.object({
  auditRemark: z.string().min(1, '拒绝原因说明不能为空').describe('拒绝原因说明备注'),
});
export class RefundRejectDto extends createZodDto(RefundRejectSchema) {}

// Order Pay Notify (Mock/Internal)
export const OrderPayNotifySchema = z.object({
  merchantOrderId: z.string().min(1).describe('商户平台订单号'),
  payOrderId: z.number().int().describe('支付订单 ID'),
  status: z.string().describe('支付状态 (SUCCESS 等)'),
  payTime: z.string().describe('支付成功时间'),
});
export class OrderPayNotifyDto extends createZodDto(OrderPayNotifySchema) {}

// Refund Notify (Mock/Internal)
export const RefundNotifySchema = z.object({
  merchantRefundId: z.string().min(1).describe('商户平台退款号'),
  refundId: z.number().int().describe('退款订单 ID'),
  status: z.string().describe('退款状态 (SUCCESS 等)'),
  refundTime: z.string().describe('退款成功时间'),
});
export class RefundNotifyDto extends createZodDto(RefundNotifySchema) {}
