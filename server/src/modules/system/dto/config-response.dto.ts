import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ConfigResponseSchema = z.object({
  id: z.number().int().describe('配置 ID'),
  name: z.string().describe('配置名称'),
  key: z.string().describe('配置键名'),
  value: z.string().describe('配置键值'),
  visible: z.boolean().describe('是否可见'),
  remark: z.string().nullable().describe('备注说明'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
});
export class ConfigResponseDto extends createZodDto(ConfigResponseSchema) {}
