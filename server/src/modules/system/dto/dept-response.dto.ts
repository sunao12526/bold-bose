import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const DeptLeaderSchema = z.object({
  id: z.number().int().describe('负责人用户 ID'),
  username: z.string().describe('负责人用户名'),
  nickname: z.string().describe('负责人昵称'),
});

export const DeptResponseSchema = z.object({
  id: z.number().int().describe('部门 ID'),
  name: z.string().describe('部门名称'),
  parentId: z.number().int().describe('父部门 ID'),
  sort: z.number().int().describe('显示顺序'),
  leaderId: z.number().int().nullable().describe('负责人用户 ID'),
  phone: z.string().nullable().describe('联系电话'),
  email: z.string().nullable().describe('联系邮箱'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
  leader: DeptLeaderSchema.nullable().optional().describe('部门负责人信息'),
});
export class DeptResponseDto extends createZodDto(DeptResponseSchema) {}
