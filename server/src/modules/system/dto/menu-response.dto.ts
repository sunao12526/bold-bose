import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus, MenuType } from '@prisma/client';

export const MenuResponseSchema = z.object({
  id: z.number().int().describe('菜单 ID'),
  name: z.string().describe('菜单名称'),
  permission: z.string().nullable().describe('权限标识'),
  type: z.enum(MenuType).describe('菜单类型'),
  parentId: z.number().int().nullable().describe('父菜单 ID'),
  path: z.string().nullable().describe('路由地址'),
  icon: z.string().nullable().describe('菜单图标'),
  sort: z.number().int().describe('显示顺序'),
  status: z.enum(CommonStatus).describe('菜单状态'),
  component: z.string().nullable().describe('组件路径'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class MenuResponseDto extends createZodDto(MenuResponseSchema) {}
