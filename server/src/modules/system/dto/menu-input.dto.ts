import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus, MenuType } from '@prisma/client';

export const CreateMenuSchema = z.object({
  name: z.string({ error: '菜单名称不能为空' }).min(1, '菜单名称不能为空').max(50, '菜单名称不能超过50个字符').describe('菜单名称'),
  permission: z.string().nullable().optional().describe('权限标识 (例如: system:user:create)'),
  type: z.enum(MenuType).default('MENU').describe('菜单类型 (DIR: 目录, MENU: 菜单, BUTTON: 按钮)'),
  parentId: z.number().int().nullable().optional().describe('父菜单 ID (0/null 表示根目录)'),
  path: z.string().nullable().optional().describe('路由地址'),
  icon: z.string().nullable().optional().describe('菜单图标'),
  sort: z.number().int().default(0).describe('显示顺序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('菜单状态 (ENABLE/DISABLE)'),
  component: z.string().nullable().optional().describe('组件路径 (前端使用)'),
});
export class CreateMenuDto extends createZodDto(CreateMenuSchema) {}

export const UpdateMenuSchema = CreateMenuSchema.partial();
export class UpdateMenuDto extends createZodDto(UpdateMenuSchema) {}
