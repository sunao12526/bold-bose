import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

// DictType DTOs
export const CreateDictTypeSchema = z.object({
  name: z.string({ error: '字典名称不能为空' }).min(1, '字典名称不能为空').max(100, '字典名称不能超过100').describe('字典名称'),
  type: z.string({ error: '字典类型不能为空' }).min(1, '字典类型不能为空').max(100, '字典类型不能超过100').describe('字典类型唯一标识'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateDictTypeDto extends createZodDto(CreateDictTypeSchema) {}

export const UpdateDictTypeSchema = CreateDictTypeSchema.partial();
export class UpdateDictTypeDto extends createZodDto(UpdateDictTypeSchema) {}

// DictData DTOs
export const CreateDictDataSchema = z.object({
  dictType: z.string({ error: '字典类型不能为空' }).min(1, '字典类型不能为空').max(100, '字典类型不能超过100').describe('所属字典类型'),
  label: z.string({ error: '数据标签不能为空' }).min(1, '数据标签不能为空').max(100, '数据标签不能超过100').describe('数据标签'),
  value: z.string({ error: '数据键值不能为空' }).min(1, '数据键值不能为空').max(100, '数据键值不能超过100').describe('数据键值'),
  sort: z.number().int().default(0).describe('显示顺序'),
  status: z.enum(CommonStatus).default('ENABLE').describe('状态 (ENABLE/DISABLE)'),
  colorType: z.string().nullable().optional().describe('颜色类型 (前端展示用)'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateDictDataDto extends createZodDto(CreateDictDataSchema) {}

export const UpdateDictDataSchema = CreateDictDataSchema.partial();
export class UpdateDictDataDto extends createZodDto(UpdateDictDataSchema) {}

export const DictDataQuerySchema = z.object({
  dictType: z.string().optional().describe('所属字典类型'),
  status: z.enum(CommonStatus).optional().describe('状态 (ENABLE/DISABLE)'),
});
export class DictDataQueryDto extends createZodDto(DictDataQuerySchema) {}
