import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const SocialLoginUrlQuerySchema = z.object({
  type: z.string({ error: '社交平台类型不能为空' }).describe('社交平台类型 (例如: GITHUB)'),
  redirectUri: z.string().optional().describe('重定向 URL'),
});
export class SocialLoginUrlQueryDto extends createZodDto(SocialLoginUrlQuerySchema) {}

export const SocialLoginSchema = z.object({
  type: z.string({ error: '社交平台类型不能为空' }).describe('社交平台类型 (例如: GITHUB)'),
  code: z.string({ error: '授权码不能为空' }).describe('OAuth 授权码'),
  redirectUri: z.string({ error: '重定向 URL 不能为空' }).describe('重定向 URL'),
});
export class SocialLoginDto extends createZodDto(SocialLoginSchema) {}

export const SocialBindSchema = z.object({
  type: z.string({ error: '社交平台类型不能为空' }).describe('社交平台类型 (例如: GITHUB)'),
  code: z.string({ error: '授权码不能为空' }).describe('OAuth 授权码'),
  redirectUri: z.string().optional().describe('重定向 URL'),
});
export class SocialBindDto extends createZodDto(SocialBindSchema) {}

export const SocialUnbindSchema = z.object({
  type: z.string({ error: '社交平台类型不能为空' }).describe('社交平台类型 (例如: GITHUB)'),
});
export class SocialUnbindDto extends createZodDto(SocialUnbindSchema) {}
