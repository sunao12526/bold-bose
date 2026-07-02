import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UserSessionResponseSchema = z.object({
  id: z.string().describe('会话 ID (UUID)'),
  token: z.string().describe('访问令牌'),
  userId: z.number().int().describe('用户 ID'),
  username: z.string().describe('用户名'),
  nickname: z.string().describe('昵称'),
  ip: z.string().describe('登录 IP'),
  userAgent: z.string().nullable().describe('UA 请求头'),
  browser: z.string().nullable().describe('解析的浏览器名称'),
  os: z.string().nullable().describe('解析的操作系统'),
  loginTime: z.string().describe('登录时间'),
  lastActiveTime: z.string().describe('最后活跃时间'),
  expiresAt: z.string().describe('过期时间'),
});
export class UserSessionResponseDto extends createZodDto(UserSessionResponseSchema) {}
