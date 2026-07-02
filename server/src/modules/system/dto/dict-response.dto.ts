import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { CommonStatus } from '@prisma/client';

export const DictTypeResponseSchema = z.object({
  id: z.number().int().describe('字典类型 ID'),
  name: z.string().describe('字典名称'),
  type: z.string().describe('字典类型'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class DictTypeResponseDto extends createZodDto(DictTypeResponseSchema) {}

export const DictDataResponseSchema = z.object({
  id: z.number().int().describe('字典数据 ID'),
  dictType: z.string().describe('所属字典类型'),
  label: z.string().describe('数据标签'),
  value: z.string().describe('数据键值'),
  sort: z.number().int().describe('显示顺序'),
  status: z.enum(CommonStatus).describe('状态 (ENABLE/DISABLE)'),
  colorType: z.string().nullable().describe('颜色类型'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class DictDataResponseDto extends createZodDto(DictDataResponseSchema) {}
