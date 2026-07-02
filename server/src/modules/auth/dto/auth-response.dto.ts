import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CaptchaResponseSchema = z.object({
  key: z.string().describe('验证码唯一标识'),
  img: z.string().describe('验证码图片内容 (SVG 字符或 Base64 格式)'),
});
export class CaptchaResponseDto extends createZodDto(CaptchaResponseSchema) {}

export const LoginResponseSchema = z.object({
  accessToken: z.string().describe('JWT 访问令牌'),
  userId: z.number().int().describe('用户 ID'),
});
export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}

export const UserPermissionSchema = z.object({
  id: z.number().int().describe('用户 ID'),
  username: z.string().describe('用户名'),
  nickname: z.string().describe('用户昵称'),
  email: z.string().nullable().describe('用户邮箱'),
  mobile: z.string().nullable().describe('用户手机号'),
});

export const PermissionInfoResponseSchema = z.object({
  user: UserPermissionSchema.describe('用户基础信息'),
  roles: z.array(z.string()).describe('用户拥有的角色标识列表'),
  permissions: z.array(z.string()).describe('用户拥有的权限标识列表'),
});
export class PermissionInfoResponseDto extends createZodDto(PermissionInfoResponseSchema) {}

export const SocialLoginUrlResponseSchema = z.object({
  url: z.string().describe('社交平台 OAuth 授权重定向链接'),
});
export class SocialLoginUrlResponseDto extends createZodDto(SocialLoginUrlResponseSchema) {}

export const SuccessResponseSchema = z.object({
  success: z.boolean().describe('执行操作是否成功'),
  message: z.string().optional().describe('提示消息'),
});
export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}

export const SocialBindStatusSchema = z.object({
  type: z.string().describe('社交平台类型 (例如: GITHUB)'),
  bound: z.boolean().describe('是否已绑定该社交账号'),
  nickname: z.string().nullable().describe('绑定的社交平台昵称'),
  avatar: z.string().nullable().describe('绑定的社交平台头像 URL'),
});
export class SocialBindStatusDto extends createZodDto(SocialBindStatusSchema) {}
