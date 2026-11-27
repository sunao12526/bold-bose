import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const WalletQuerySchema = PaginationQuerySchema.extend({
  userId: z.coerce.number().int().optional(),
  userType: z.coerce.number().int().optional(),
});
export class WalletQueryDto extends createZodDto(WalletQuerySchema) {}

export const AdjustWalletBalanceSchema = z.object({
  userId: z.coerce.number().int(),
  userType: z.coerce.number().int().optional().default(1),
  price: z.coerce.number().int().refine((v) => v !== 0, '调整金额不能为 0'),
  title: z.string().min(1).max(128).optional().default('后台余额调整'),
});
export class AdjustWalletBalanceDto extends createZodDto(AdjustWalletBalanceSchema) {}

export const CreateRechargePackageSchema = z.object({
  name: z.string({ error: '套餐名称不能为空' }).min(1).max(64),
  payPrice: z.coerce.number().int().min(1, '充值金额必须大于 0'),
  bonusPrice: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
});
export class CreateRechargePackageDto extends createZodDto(CreateRechargePackageSchema) {}

export const UpdateRechargePackageSchema = CreateRechargePackageSchema.partial();
export class UpdateRechargePackageDto extends createZodDto(UpdateRechargePackageSchema) {}

export const CreateWalletRechargeSchema = z.object({
  packageId: z.coerce.number().int().optional(),
  payPrice: z.coerce.number().int().min(1).optional(),
});
export class CreateWalletRechargeDto extends createZodDto(CreateWalletRechargeSchema) {}
