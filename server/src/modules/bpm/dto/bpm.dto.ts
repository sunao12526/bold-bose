import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';

// ================= Category =================
export const BpmCategoryQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  code: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class BpmCategoryQueryDto extends createZodDto(BpmCategoryQuerySchema) {}

export const CreateBpmCategorySchema = z.object({
  name: z.string().min(1).max(64),
  code: z.string().min(1).max(64),
  description: z.string().max(500).nullable().optional(),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
  sort: z.coerce.number().int().optional().default(0),
});
export class CreateBpmCategoryDto extends createZodDto(CreateBpmCategorySchema) {}

export const UpdateBpmCategorySchema = CreateBpmCategorySchema.partial();
export class UpdateBpmCategoryDto extends createZodDto(UpdateBpmCategorySchema) {}

// ================= Form =================
export const BpmFormQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class BpmFormQueryDto extends createZodDto(BpmFormQuerySchema) {}

export const CreateBpmFormSchema = z.object({
  name: z.string().min(1).max(100),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
  conf: z.any().default({}),
  fields: z.any().default([]),
  remark: z.string().max(500).nullable().optional(),
});
export class CreateBpmFormDto extends createZodDto(CreateBpmFormSchema) {}

export const UpdateBpmFormSchema = CreateBpmFormSchema.partial();
export class UpdateBpmFormDto extends createZodDto(UpdateBpmFormSchema) {}

// ================= Model =================
export const BpmNodeConfigSchema = z.object({
  nodeKey: z.string().min(1).max(64),
  name: z.string().min(1).max(100),
  type: z.enum(['APPROVE', 'CC']),
  approveType: z.enum(['OR', 'AND']).optional().default('OR'),
  assigneeType: z
    .enum(['USER', 'ROLE', 'DEPT_LEADER'])
    .optional()
    .default('USER'),
  assigneeIds: z.array(z.coerce.number().int()).optional().default([]),
});
export type BpmNodeConfig = z.infer<typeof BpmNodeConfigSchema>;

export const BpmModelQuerySchema = PaginationQuerySchema.extend({
  key: z.string().optional(),
  name: z.string().optional(),
  categoryCode: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class BpmModelQueryDto extends createZodDto(BpmModelQuerySchema) {}

export const CreateBpmModelSchema = z.object({
  key: z.string().min(1).max(64),
  name: z.string().min(1).max(100),
  categoryCode: z.string().min(1).max(64),
  formId: z.coerce.number().int().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  nodes: z.array(BpmNodeConfigSchema).min(1, '至少配置一个流程节点'),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
});
export class CreateBpmModelDto extends createZodDto(CreateBpmModelSchema) {}

export const UpdateBpmModelSchema = CreateBpmModelSchema.partial();
export class UpdateBpmModelDto extends createZodDto(UpdateBpmModelSchema) {}

// ================= Runtime =================
export const StartProcessInstanceSchema = z.object({
  modelKey: z.string().min(1).max(64),
  name: z.string().min(1).max(128).optional(),
  formVariables: z.record(z.string(), z.any()).optional(),
  businessKey: z.string().max(100).optional(),
});
export class StartProcessInstanceDto extends createZodDto(StartProcessInstanceSchema) {}

export const TaskReasonSchema = z.object({
  reason: z.string().max(500).optional().default(''),
});
export class TaskReasonDto extends createZodDto(TaskReasonSchema) {}

export const TransferTaskSchema = z.object({
  targetUserId: z.coerce.number().int(),
  reason: z.string().max(500).optional().default(''),
});
export class TransferTaskDto extends createZodDto(TransferTaskSchema) {}

export const CreateOaLeaveSchema = z.object({
  type: z.coerce.number().int().min(1).max(5),
  reason: z.string().min(1).max(1000),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  day: z.coerce.number().positive(),
});
export class CreateOaLeaveDto extends createZodDto(CreateOaLeaveSchema) {}
