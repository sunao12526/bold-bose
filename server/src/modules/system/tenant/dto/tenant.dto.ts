import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../../shared/dto/pagination.dto';

export const TenantPackageQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class TenantPackageQueryDto extends createZodDto(TenantPackageQuerySchema) {}

export const CreateTenantPackageSchema = z.object({
  name: z.string({ error: '套餐名称不能为空' }).min(1).max(50),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
  remark: z.string().max(500).nullable().optional(),
  menuIds: z.array(z.number().int()).default([]),
});
export class CreateTenantPackageDto extends createZodDto(CreateTenantPackageSchema) {}

export const UpdateTenantPackageSchema = CreateTenantPackageSchema.partial();
export class UpdateTenantPackageDto extends createZodDto(UpdateTenantPackageSchema) {}

export const TenantQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  contactName: z.string().optional(),
  contactMobile: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class TenantQueryDto extends createZodDto(TenantQuerySchema) {}

export const CreateTenantSchema = z.object({
  name: z.string({ error: '租户名称不能为空' }).min(1).max(50),
  contactUserId: z.number().int().nullable().optional(),
  contactName: z.string({ error: '联系人不能为空' }).min(1).max(50),
  contactMobile: z.string().max(20).nullable().optional(),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
  website: z.string().max(256).nullable().optional(),
  packageId: z.number().int().nullable().optional(),
  expireTime: z.coerce.date({ error: '过期时间格式不正确' }),
  accountCount: z.coerce.number().int().min(1).default(100),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).max(50).optional(),
});
export class CreateTenantDto extends createZodDto(CreateTenantSchema) {}

export const UpdateTenantSchema = CreateTenantSchema.omit({
  username: true,
  password: true,
}).partial();
export class UpdateTenantDto extends createZodDto(UpdateTenantSchema) {}
