import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const OAuth2ClientResponseSchema = z.object({
  id: z.number().int().describe('客户端自增 ID'),
  clientId: z.string().describe('客户端 ID'),
  secret: z.string().describe('客户端密钥'),
  name: z.string().describe('客户端名称'),
  logo: z.string().nullable().describe('客户端 Logo URL'),
  redirectUris: z.string().describe('回调地址列表 JSON 字符串'),
  scopes: z.string().describe('授权范围列表 JSON 字符串'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class OAuth2ClientResponseDto extends createZodDto(OAuth2ClientResponseSchema) {}

export const OAuth2TokenResponseSchema = z.object({
  access_token: z.string().describe('访问令牌'),
  token_type: z.string().describe('令牌类型 (通常为 Bearer)'),
  expires_in: z.number().int().describe('有效时长 (秒)'),
  refresh_token: z.string().optional().describe('刷新令牌 (非必有)'),
  scope: z.string().optional().describe('最终生效的权限范围'),
});
export class OAuth2TokenResponseDto extends createZodDto(OAuth2TokenResponseSchema) {}

export const OAuth2UserInfoResponseSchema = z.object({
  sub: z.string().describe('主体唯一标识符'),
  id: z.number().int().optional().describe('用户 ID (非必有，客户端凭证模式无此项)'),
  username: z.string().optional().describe('用户名 (非必有)'),
  nickname: z.string().optional().describe('昵称 (非必有)'),
  email: z.string().nullable().optional().describe('邮箱 (非必有)'),
  mobile: z.string().nullable().optional().describe('手机 (非必有)'),
  client_id: z.string().optional().describe('客户端 ID (客户端凭证模式有此项)'),
  scopes: z.array(z.string()).optional().describe('生效的权限列表 (客户端凭证模式有此项)'),
});
export class OAuth2UserInfoResponseDto extends createZodDto(OAuth2UserInfoResponseSchema) {}
