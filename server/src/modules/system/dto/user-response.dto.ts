import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const UserRoleInfoSchema = z.object({
  roleId: z.number().int().describe('角色 ID'),
  role: z.object({
    id: z.number().int().describe('角色 ID'),
    name: z.string().describe('角色名称'),
    code: z.string().describe('角色编码'),
  }).optional().describe('角色详细信息'),
});

export const UserPostInfoSchema = z.object({
  postId: z.number().int().describe('岗位 ID'),
  post: z.object({
    id: z.number().int().describe('岗位 ID'),
    name: z.string().describe('岗位名称'),
    code: z.string().describe('岗位编码'),
  }).optional().describe('岗位详细信息'),
});

export const UserDeptInfoSchema = z.object({
  id: z.number().int().describe('部门 ID'),
  name: z.string().describe('部门名称'),
});

export const UserResponseSchema = z.object({
  id: z.number().int().describe('用户 ID'),
  username: z.string().describe('用户名'),
  nickname: z.string().describe('用户昵称'),
  avatar: z.string().nullable().describe('头像 URL'),
  email: z.string().nullable().describe('用户邮箱'),
  mobile: z.string().nullable().describe('手机号码'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注说明'),
  deptId: z.number().int().nullable().describe('部门 ID'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
  roles: z.array(UserRoleInfoSchema).optional().describe('分配的角色关联'),
  posts: z.array(UserPostInfoSchema).optional().describe('分配的岗位关联'),
  dept: UserDeptInfoSchema.nullable().optional().describe('部门信息'),
});
export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export const UserListResponseSchema = z.object({
  items: z.array(UserResponseSchema).describe('用户列表数据'),
  total: z.number().int().describe('总记录数'),
});
export class UserListResponseDto extends createZodDto(UserListResponseSchema) {}
