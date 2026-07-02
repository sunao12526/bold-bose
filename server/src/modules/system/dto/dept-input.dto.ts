import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateDeptSchema = z.object({
  name: z.string({ error: '部门名称不能为空' }).min(1, '部门名称不能为空').max(100, '部门名称不能超过100个字符').describe('部门名称'),
  parentId: z.number().int().default(0).describe('父部门 ID (0 表示最顶级部门)'),
  sort: z.number().int().default(0).describe('显示顺序 (升序)'),
  leaderId: z.number().int().nullable().optional().describe('负责人用户 ID'),
  phone: z.string().nullable().optional().describe('联系电话'),
  email: z.string().email('邮箱格式不正确').nullable().optional().or(z.literal('')).describe('联系邮箱'),
  status: z.enum(CommonStatus).default('ENABLE').describe('部门状态 (ENABLE/DISABLE)'),
});
export class CreateDeptDto extends createZodDto(CreateDeptSchema) {}

export const UpdateDeptSchema = CreateDeptSchema.partial();
export class UpdateDeptDto extends createZodDto(UpdateDeptSchema) {}
