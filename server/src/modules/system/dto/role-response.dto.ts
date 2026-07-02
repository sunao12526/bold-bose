import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const RoleMenuInfoSchema = z.object({
  menuId: z.number().int().describe('关联的菜单 ID'),
});

export const RoleResponseSchema = z.object({
  id: z.number().int().describe('角色 ID'),
  name: z.string().describe('角色名称'),
  code: z.string().describe('角色权限字符'),
  sort: z.number().int().describe('显示顺序'),
  status: z.enum(CommonStatus).describe('角色状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
  menus: z.array(RoleMenuInfoSchema).optional().describe('关联的菜单列表'),
});
export class RoleResponseDto extends createZodDto(RoleResponseSchema) {}

export const RoleListResponseSchema = z.object({
  items: z.array(RoleResponseSchema).describe('角色数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class RoleListResponseDto extends createZodDto(RoleListResponseSchema) {}
