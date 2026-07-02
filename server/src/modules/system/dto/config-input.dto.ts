import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateConfigSchema = z.object({
  name: z.string({ error: '配置名称不能为空' }).min(1, '配置名称不能为空').max(100, '配置名称不能超过100').describe('配置名称'),
  key: z.string({ error: '配置键名不能为空' }).min(1, '配置键名不能为空').max(100, '配置键名不能超过100').describe('配置键名'),
  value: z.string({ error: '配置键值不能为空' }).min(1, '配置键值不能为空').max(500, '配置键值不能超过500').describe('配置键值'),
  visible: z.boolean().default(true).describe('是否系统内置/对前端可见'),
  remark: z.string().nullable().optional().describe('备注说明'),
});
export class CreateConfigDto extends createZodDto(CreateConfigSchema) {}

export const UpdateConfigSchema = CreateConfigSchema.partial();
export class UpdateConfigDto extends createZodDto(UpdateConfigSchema) {}

export const ConfigKeyQuerySchema = z.object({
  key: z.string({ error: '键名参数 key 不能为空' }).describe('配置键名'),
});
export class ConfigKeyQueryDto extends createZodDto(ConfigKeyQuerySchema) {}
