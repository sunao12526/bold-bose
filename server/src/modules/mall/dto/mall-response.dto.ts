import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus, MallOrderStatus, MallRefundStatus, MallCouponType, MallCouponScopeType, MallCouponValidityType, MallCouponUserStatus } from '@prisma/client';

export const MallCategoryResponseSchema = z.object({
  id: z.number().int().describe('分类自增 ID'),
  name: z.string().describe('分类名称'),
  parentId: z.number().int().nullable().describe('父分类 ID'),
  picUrl: z.string().nullable().describe('分类图片链接'),
  sort: z.number().int().describe('排序'),
  status: z.enum(CommonStatus).describe('启用状态'),
  remark: z.string().nullable().describe('备注'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MallCategoryResponseDto extends createZodDto(MallCategoryResponseSchema) {}

export const MallBrandResponseSchema = z.object({
  id: z.number().int().describe('品牌自增 ID'),
  name: z.string().describe('品牌名称'),
  logo: z.string().nullable().describe('品牌 LOGO 链接'),
  sort: z.number().int().describe('排序'),
  status: z.enum(CommonStatus).describe('启用状态'),
  remark: z.string().nullable().describe('备注'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MallBrandResponseDto extends createZodDto(MallBrandResponseSchema) {}

export const MallBrandListResponseSchema = z.object({
  items: z.array(MallBrandResponseSchema).describe('品牌列表'),
  total: z.number().int().describe('总数'),
});
export class MallBrandListResponseDto extends createZodDto(MallBrandListResponseSchema) {}

export const MallPropertyResponseSchema = z.object({
  id: z.number().int().describe('规格属性自增 ID'),
  name: z.string().describe('属性名称'),
  remark: z.string().nullable().describe('备注'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MallPropertyResponseDto extends createZodDto(MallPropertyResponseSchema) {}

export const MallPropertyValueResponseSchema = z.object({
  id: z.number().int().describe('规格值自增 ID'),
  propertyId: z.number().int().describe('属性 ID'),
  value: z.string().describe('属性值'),
  remark: z.string().nullable().describe('备注'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MallPropertyValueResponseDto extends createZodDto(MallPropertyValueResponseSchema) {}

export const MallCouponResponseSchema = z.object({
  id: z.number().int().describe('优惠券自增 ID'),
  name: z.string().describe('优惠券名称'),
  type: z.enum(MallCouponType).describe('优惠券类型'),
  minPrice: z.number().int().describe('使用门槛 (分)'),
  value: z.number().int().describe('减免金额 (分) 或折扣率'),
  totalCount: z.number().int().describe('发行总量'),
  takeCount: z.number().int().describe('领用总量'),
  useCount: z.number().int().describe('使用总量'),
  scopeType: z.enum(MallCouponScopeType).describe('商品适用范围类型'),
  scopeValue: z.array(z.number()).nullable().describe('适用范围具体 ID 列表'),
  validityType: z.enum(MallCouponValidityType).describe('有效期类型'),
  validStartTime: z.string().nullable().describe('固定日期有效开始时间'),
  validEndTime: z.string().nullable().describe('固定日期有效截止时间'),
  validDays: z.number().int().nullable().describe('领券后生效天数'),
  status: z.enum(CommonStatus).describe('启用状态'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MallCouponResponseDto extends createZodDto(MallCouponResponseSchema) {}

export const MallCouponListResponseSchema = z.object({
  items: z.array(MallCouponResponseSchema).describe('优惠券列表'),
  total: z.number().int().describe('总记录数'),
});
export class MallCouponListResponseDto extends createZodDto(MallCouponListResponseSchema) {}

export const MallCouponUserResponseSchema = z.object({
  id: z.number().int().describe('用户持有的优惠券 ID'),
  couponId: z.number().int().describe('优惠券模板 ID'),
  memberId: z.number().int().describe('会员用户 ID'),
  status: z.enum(MallCouponUserStatus).describe('优惠券持有状态'),
  useOrderId: z.number().int().nullable().describe('所使用的订单 ID'),
  validStartTime: z.string().describe('有效期开始时间'),
  validEndTime: z.string().describe('有效期截止时间'),
  useTime: z.string().nullable().describe('实际使用时间'),
  createdAt: z.string().describe('领取时间'),
  updatedAt: z.string().describe('修改时间'),
  coupon: MallCouponResponseSchema.optional().describe('优惠券具体属性信息'),
});
export class MallCouponUserResponseDto extends createZodDto(MallCouponUserResponseSchema) {}

export const SkuPropertyResponseSchema = z.object({
  propertyId: z.number().int().describe('规格属性 ID'),
  propertyName: z.string().describe('规格属性名称'),
  valueId: z.number().int().describe('规格属性值 ID'),
  valueName: z.string().describe('规格属性值名称'),
});

export const MallOrderItemResponseSchema = z.object({
  id: z.number().int().describe('订单项 ID'),
  orderId: z.number().int().describe('关联的订单 ID'),
  spuId: z.number().int().describe('商品 SPU ID'),
  skuId: z.number().int().describe('商品 SKU ID'),
  spuName: z.string().describe('商品名称'),
  picUrl: z.string().describe('商品主图 URL'),
  properties: z.array(SkuPropertyResponseSchema).describe('商品属性规格列表'),
  price: z.number().int().describe('下单单价 (分)'),
  count: z.number().int().describe('购买数量'),
});
export class MallOrderItemResponseDto extends createZodDto(MallOrderItemResponseSchema) {}


export const MallOrderResponseSchema = z.object({
  id: z.number().int().describe('商城订单自增 ID'),
  no: z.string().describe('订单编号'),
  memberId: z.number().int().describe('会员 ID'),
  status: z.enum(MallOrderStatus).describe('订单状态 (UNPAID/SUCCESS/DELIVERED/COMPLETED/CLOSED)'),
  payPrice: z.number().int().describe('实际应付金额 (分)'),
  totalPrice: z.number().int().describe('订单商品原始总价 (分)'),
  discountPrice: z.number().int().describe('优惠减免总额 (分)'),
  deliveryStatus: z.boolean().describe('是否已发货'),
  logisticsCo: z.string().nullable().describe('物流快递公司名称'),
  logisticsNo: z.string().nullable().describe('物流快递跟踪单号'),
  receiverName: z.string().describe('收货人姓名'),
  receiverMobile: z.string().describe('收货人手机号'),
  receiverAddress: z.string().describe('收货详细地址'),
  userRemark: z.string().nullable().describe('买家备注'),
  payTime: z.string().nullable().describe('付款时间'),
  deliveryTime: z.string().nullable().describe('发货时间'),
  receiveTime: z.string().nullable().describe('确认收货时间'),
  createdAt: z.string().describe('下单时间'),
  updatedAt: z.string().describe('更新时间'),
  items: z.array(MallOrderItemResponseSchema).optional().describe('订单项明细列表'),
});
export class MallOrderResponseDto extends createZodDto(MallOrderResponseSchema) {}

export const MallOrderListResponseSchema = z.object({
  items: z.array(MallOrderResponseSchema).describe('订单数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class MallOrderListResponseDto extends createZodDto(MallOrderListResponseSchema) {}

export const MallOrderRefundResponseSchema = z.object({
  id: z.number().int().describe('退款售后单 ID'),
  no: z.string().describe('退款单号'),
  orderId: z.number().int().describe('关联的订单 ID'),
  memberId: z.number().int().describe('会员 ID'),
  refundPrice: z.number().int().describe('申请退款金额 (分)'),
  status: z.enum(MallRefundStatus).describe('退款状态 (APPLY/SUCCESS/CLOSED/FAIL)'),
  reason: z.string().describe('退款申请原因'),
  userRemark: z.string().nullable().describe('买家备注'),
  auditRemark: z.string().nullable().describe('审核备注说明'),
  auditTime: z.string().nullable().describe('审核处理时间'),
  createdAt: z.string().describe('退款单申请时间'),
  updatedAt: z.string().describe('更新时间'),
  order: MallOrderResponseSchema.optional().describe('原订单项明细'),
});
export class MallOrderRefundResponseDto extends createZodDto(MallOrderRefundResponseSchema) {}

export const MallOrderRefundListResponseSchema = z.object({
  items: z.array(MallOrderRefundResponseSchema).describe('退款单列表'),
  total: z.number().int().describe('总记录数'),
});
export class MallOrderRefundListResponseDto extends createZodDto(MallOrderRefundListResponseSchema) {}

export const SkuResponseSchema = z.object({
  id: z.number().int().describe('SKU ID'),
  spuId: z.number().int().describe('SPU ID'),
  properties: z.array(SkuPropertyResponseSchema).describe('SKU属性规格'),
  price: z.number().int().describe('单价 (分)'),
  marketPrice: z.number().int().nullable().describe('市场价 (分)'),
  costPrice: z.number().int().nullable().describe('成本价 (分)'),
  stock: z.number().int().describe('库存数'),
  picUrl: z.string().nullable().describe('图片 URL'),
  barCode: z.string().nullable().describe('条码'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});

export const SpuResponseSchema = z.object({
  id: z.number().int().describe('SPU ID'),
  name: z.string().describe('商品名称'),
  categoryId: z.number().int().describe('分类 ID'),
  brandId: z.number().int().nullable().describe('品牌 ID'),
  picUrl: z.string().describe('主图 URL'),
  sliderPicUrls: z.array(z.string()).describe('轮播图 URLs'),
  description: z.string().nullable().describe('商品描述'),
  sort: z.number().int().describe('排序'),
  status: z.enum(CommonStatus).describe('启用状态'),
  salesCount: z.number().int().describe('销量'),
  minPrice: z.number().int().describe('最低价格 (分)'),
  maxPrice: z.number().int().describe('最高价格 (分)'),
  totalStock: z.number().int().describe('总库存'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
  skus: z.array(SkuResponseSchema).optional().describe('SKU 列表详情'),
});
export class SpuResponseDto extends createZodDto(SpuResponseSchema) {}

export const SpuListResponseSchema = z.object({
  items: z.array(SpuResponseSchema).describe('商品列表'),
  total: z.number().int().describe('总数'),
});
export class SpuListResponseDto extends createZodDto(SpuListResponseSchema) {}

