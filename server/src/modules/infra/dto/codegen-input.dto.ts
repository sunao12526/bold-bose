import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const ImportTablesSchema = z.object({
  tableNames: z.array(z.string(), { error: 'tableNames 必须是字符串数组' }).min(1, 'tableNames 不能为空').describe('要导入的数据库表名列表'),
  author: z.string().optional().describe('作者名称'),
});
export class ImportTablesDto extends createZodDto(ImportTablesSchema) {}

export const UpdateCodegenColumnSchema = z.object({
  id: z.number().int().describe('字段自增 ID'),
  columnComment: z.string().max(500).describe('字段备注描述'),
  tsType: z.string().max(50).describe('TypeScript 数据类型'),
  prismaType: z.string().max(50).describe('Prisma 对应数据类型'),
  crud: z.boolean().describe('是否作为 CRUD 接口属性'),
  listOperation: z.boolean().describe('是否作为列表查询过滤项'),
  listOperationCondition: z.string().max(20).describe('列表查询过滤条件，如 =, LIKE, BETWEEN'),
  formOperation: z.boolean().describe('是否作为表单操作属性'),
  htmlType: z.string().max(50).describe('前端 HTML 控件类型'),
  dictType: z.string().nullable().optional().describe('引用的字典类型唯一码'),
});

export const UpdateCodegenTableSchema = z.object({
  tableComment: z.string().max(500).optional().describe('表备注描述'),
  className: z.string().max(100).optional().describe('对应生成实体类名'),
  moduleName: z.string().max(100).optional().describe('对应生成模块名'),
  businessName: z.string().max(100).optional().describe('对应生成业务功能名'),
  classComment: z.string().max(200).optional().describe('对应生成类的中文功能注解'),
  author: z.string().max(50).optional().describe('作者名'),
  columns: z.array(UpdateCodegenColumnSchema).optional().describe('所有字段配置详情列表'),
});
export class UpdateCodegenTableDto extends createZodDto(UpdateCodegenTableSchema) {}
