import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateUserSchema = z.object({
  username: z.string({ error: '用户名不能为空' }).min(2, '用户名不能少于2个字符').max(50, '用户名不能超过50个字符').describe('用户名'),
  password: z.string({ error: '密码不能为空' }).min(6, '密码不能少于6个字符').max(100, '密码不能超过100个字符').describe('密码'),
  nickname: z.string({ error: '昵称不能为空' }).min(1, '昵称不能为空').max(50, '昵称不能超过50个字符').describe('用户昵称'),
  avatar: z.string().nullable().optional().describe('头像 URL'),
  email: z.string().email('邮箱格式不正确').nullable().optional().or(z.literal('')).describe('用户邮箱'),
  mobile: z.string().nullable().optional().describe('手机号码'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
  deptId: z.number().int().nullable().optional().describe('部门 ID'),
  roleIds: z.array(z.number().int()).optional().describe('角色 ID 列表'),
  postIds: z.array(z.number().int()).optional().describe('岗位 ID 列表'),
});
export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  password: z.string().min(6, '密码不能少于6个字符').optional().describe('密码'),
});
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export const AssignUserRolesSchema = z.object({
  roleIds: z.array(z.number().int(), { error: '角色 ID 列表不能为空' }).describe('分配的角色 ID 列表'),
});
export class AssignUserRolesDto extends createZodDto(AssignUserRolesSchema) {}
