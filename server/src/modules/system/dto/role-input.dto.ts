import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateRoleSchema = z.object({
  name: z.string({ error: '角色名称不能为空' }).min(1, '角色名称不能为空').max(50, '角色名称不能超过50个字符').describe('角色名称'),
  code: z.string({ error: '角色权限字符不能为空' }).min(1, '角色权限字符不能为空').max(50, '角色权限字符不能超过50个字符').describe('角色权限字符'),
  sort: z.number().int().default(0).describe('显示顺序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('角色状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注'),
});
export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}

export const UpdateRoleSchema = CreateRoleSchema.partial();
export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}

export const AssignRoleMenusSchema = z.object({
  menuIds: z.array(z.number().int(), { error: '菜单 ID 列表不能为空' }).describe('菜单 ID 列表'),
});
export class AssignRoleMenusDto extends createZodDto(AssignRoleMenusSchema) {}
