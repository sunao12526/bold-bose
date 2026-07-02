import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const CreateJobSchema = z.object({
  name: z.string({ error: '任务名称不能为空' }).min(1, '任务名称不能为空').max(100, '任务名称不能超过100').describe('任务名称'),
  handlerName: z.string({ error: '处理器名称不能为空' }).min(1, '处理器名称不能为空').max(100, '处理器名称不能超过100').describe('Job处理器名称'),
  cronExpression: z.string({ error: 'Cron 表达式不能为空' }).min(1, 'Cron 表达式不能为空').max(100, 'Cron 表达式不能超过100').describe('Cron 表达式'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateJobDto extends createZodDto(CreateJobSchema) {}

export const UpdateJobSchema = CreateJobSchema.partial();
export class UpdateJobDto extends createZodDto(UpdateJobSchema) {}
