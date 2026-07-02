import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateProfileSchema = z.object({
  nickname: z.string({ error: '昵称不能为空' }).min(1, '昵称不能为空').max(50, '昵称不能超过50个字符').describe('用户昵称'),
  email: z.string().email('邮箱格式不正确').nullable().optional().or(z.literal('')).describe('用户邮箱'),
  mobile: z.string().nullable().optional().describe('手机号码'),
  avatar: z.string().nullable().optional().describe('头像 URL'),
});
export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string({ error: '原密码不能为空' }).min(6, '密码长度不能少于6位').describe('原密码'),
  newPassword: z.string({ error: '新密码不能为空' }).min(6, '密码长度不能少于6位').describe('新密码'),
});
export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {}
