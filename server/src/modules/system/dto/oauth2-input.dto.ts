import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// OAuth2 Client DTOs
export const CreateOAuth2ClientSchema = z.object({
  clientId: z.string({ error: '客户端 ID 不能为空' }).min(1, '客户端 ID 不能为空').max(100, '客户端 ID 不能超过100').describe('客户端 ID'),
  secret: z.string({ error: '客户端密钥不能为空' }).min(1, '客户端密钥不能为空').max(100, '客户端密钥不能超过100').describe('客户端密钥'),
  name: z.string({ error: '客户端名称不能为空' }).min(1, '客户端名称不能为空').max(100, '客户端名称不能超过100').describe('客户端名称'),
  logo: z.string().nullable().optional().describe('客户端 Logo URL'),
  redirectUris: z.array(z.string()).or(z.string()).describe('允许的重定向/回调地址列表 (可以是数组或 JSON 字符串)'),
  scopes: z.array(z.string()).or(z.string()).describe('授权的权限范围列表 (可以是数组或 JSON 字符串)'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
});
export class CreateOAuth2ClientDto extends createZodDto(CreateOAuth2ClientSchema) {}

export const UpdateOAuth2ClientSchema = CreateOAuth2ClientSchema.partial();
export class UpdateOAuth2ClientDto extends createZodDto(UpdateOAuth2ClientSchema) {}

// OAuth2 Flow DTOs
export const OAuth2AuthorizeQuerySchema = z.object({
  client_id: z.string({ error: 'client_id 不能为空' }).describe('客户端 ID'),
  redirect_uri: z.string({ error: 'redirect_uri 不能为空' }).describe('重定向 URI'),
  response_type: z.string({ error: 'response_type 不能为空' }).describe('授权类型 (通常为 code)'),
  scope: z.string().optional().describe('申请的权限范围，以空格分隔'),
  state: z.string().optional().describe('客户端状态值，原样返回'),
});
export class OAuth2AuthorizeQueryDto extends createZodDto(OAuth2AuthorizeQuerySchema) {}

export const OAuth2TokenBodySchema = z.object({
  grant_type: z.string({ error: 'grant_type 不能为空' }).describe('授权模式'),
  code: z.string().optional().describe('授权码 (grant_type 为 authorization_code 时必填)'),
  client_id: z.string({ error: 'client_id 不能为空' }).describe('客户端 ID'),
  client_secret: z.string({ error: 'client_secret 不能为空' }).describe('客户端密钥'),
  redirect_uri: z.string().optional().describe('重定向 URI'),
});
export class OAuth2TokenBodyDto extends createZodDto(OAuth2TokenBodySchema) {}
