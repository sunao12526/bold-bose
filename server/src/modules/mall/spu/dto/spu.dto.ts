import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const SkuPropertySchema = z.object({
  propertyId: z.number().int(),
  propertyName: z.string().min(1),
  valueId: z.number().int(),
  valueName: z.string().min(1),
});
export class SkuPropertyDto extends createZodDto(SkuPropertySchema) { }

export const SkuSchema = z.object({
  properties: z.array(SkuPropertySchema),
  price: z.number().int().min(0),
  marketPrice: z.number().int().min(0).optional(),
  costPrice: z.number().int().min(0).optional(),
  stock: z.number().int().min(0),
  picUrl: z.string().optional(),
  barCode: z.string().optional(),
});
export class SkuDto extends createZodDto(SkuSchema) { }

export const CreateSpuSchema = z.object({
  name: z.string({ error: '商品名称不能为空' }).min(1, '商品名称不能为空'),
  categoryId: z.number({ error: '分类ID不能为空' }).int('分类ID必须是整数'),
  brandId: z.number().int('品牌ID必须是整数').optional(),
  picUrl: z.string({ error: '商品主图不能为空' }).min(1, '商品主图不能为空'),
  sliderPicUrls: z.array(z.string()).min(1, '轮播图不能为空'),
  description: z.string().optional(),
  sort: z.number().int().min(0).optional(),
  status: z.enum(CommonStatus, { error: '状态值不合法' }).optional(),
  skus: z.array(SkuSchema).min(1, 'SKU列表不能为空'),
});
export class CreateSpuDto extends createZodDto(CreateSpuSchema) { }

export class UpdateSpuDto extends createZodDto(CreateSpuSchema) { }

export const SpuQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  categoryId: z.coerce.number().int().optional(),
  brandId: z.coerce.number().int().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class SpuQueryDto extends createZodDto(SpuQuerySchema) { }
