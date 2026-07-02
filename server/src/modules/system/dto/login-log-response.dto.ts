import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginLogResponseSchema = z.object({
  id: z.number().int().describe('日志自增 ID'),
  username: z.string().describe('登录账号名'),
  ip: z.string().describe('登录 IP 地址'),
  userAgent: z.string().describe('请求 User-Agent 头'),
  status: z.string().describe('登录结果状态 (SUCCESS/FAIL)'),
  message: z.string().nullable().describe('结果提示消息'),
  loginTime: z.string().describe('登录发生时间'),
});
export class LoginLogResponseDto extends createZodDto(LoginLogResponseSchema) {}

export const LoginLogListResponseSchema = z.object({
  items: z.array(LoginLogResponseSchema).describe('登录日志数据列表'),
  total: z.number().int().describe('总记录数'),
});
export class LoginLogListResponseDto extends createZodDto(LoginLogListResponseSchema) {}
