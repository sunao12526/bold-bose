import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const OperationLogResponseSchema = z.object({
  id: z.number().int().describe('日志自增 ID'),
  userId: z.number().int().nullable().describe('操作用户 ID'),
  username: z.string().nullable().describe('操作用户名'),
  module: z.string().describe('系统模块'),
  type: z.string().describe('操作类型 (e.g. CREATE, UPDATE, DELETE)'),
  description: z.string().describe('操作描述'),
  path: z.string().describe('请求路径'),
  method: z.string().describe('请求方法'),
  ip: z.string().describe('操作 IP 地址'),
  status: z.number().int().describe('HTTP 状态码'),
  duration: z.number().int().describe('执行耗时 (毫秒)'),
  createdAt: z.string().describe('操作发生时间'),
});
export class OperationLogResponseDto extends createZodDto(OperationLogResponseSchema) {}
