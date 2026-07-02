import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const ProfileUserSchema = z.object({
  id: z.number().int().describe('用户 ID'),
  username: z.string().describe('用户名'),
  nickname: z.string().describe('用户昵称'),
  avatar: z.string().nullable().describe('头像 URL'),
  email: z.string().nullable().describe('用户邮箱'),
  mobile: z.string().nullable().describe('手机号码'),
  remark: z.string().nullable().describe('备注说明'),
  status: z.enum(CommonStatus).describe('状态'),
  createdAt: z.string().describe('创建时间'),
});

export const ProfileRoleInfoSchema = z.object({
  id: z.number().int().describe('角色 ID'),
  name: z.string().describe('角色名称'),
  code: z.string().describe('角色编码'),
});

export const ProfileResponseSchema = z.object({
  user: ProfileUserSchema.describe('用户个人信息'),
  roles: z.array(ProfileRoleInfoSchema).describe('拥有的角色列表'),
});
export class ProfileResponseDto extends createZodDto(ProfileResponseSchema) {}

export const ProfileUpdateResponseSchema = z.object({
  id: z.number().int().describe('用户 ID'),
  username: z.string().describe('用户名'),
  nickname: z.string().describe('用户昵称'),
  avatar: z.string().nullable().describe('头像 URL'),
  email: z.string().nullable().describe('用户邮箱'),
  mobile: z.string().nullable().describe('手机号码'),
});
export class ProfileUpdateResponseDto extends createZodDto(ProfileUpdateResponseSchema) {}

export const UploadAvatarResponseSchema = z.object({
  url: z.string().describe('上传后的头像访问 URL'),
});
export class UploadAvatarResponseDto extends createZodDto(UploadAvatarResponseSchema) {}
