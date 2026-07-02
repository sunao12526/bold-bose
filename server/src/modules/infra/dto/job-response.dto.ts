import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const JobResponseSchema = z.object({
  id: z.number().int().describe('任务自增 ID'),
  name: z.string().describe('任务名称'),
  handlerName: z.string().describe('处理器名称'),
  cronExpression: z.string().describe('Cron 表达式'),
  status: z.enum(CommonStatus).describe('状态'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class JobResponseDto extends createZodDto(JobResponseSchema) {}

export const JobLogResponseSchema = z.object({
  id: z.number().int().describe('日志自增 ID'),
  jobId: z.number().int().describe('任务 ID'),
  handlerName: z.string().describe('处理器名称'),
  status: z.number().int().describe('运行状态码 (200: 成功, 500: 失败)'),
  duration: z.number().int().describe('运行耗时 (毫秒)'),
  errorMessage: z.string().nullable().describe('异常报错信息'),
  createdAt: z.string().describe('记录时间'),
});
export class JobLogResponseDto extends createZodDto(JobLogResponseSchema) {}
