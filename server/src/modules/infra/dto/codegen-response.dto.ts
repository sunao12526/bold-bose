import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const DbTableInfoSchema = z.object({
  tableName: z.string().describe('表名称'),
  tableComment: z.string().describe('表说明'),
});
export class DbTableInfoResponseDto extends createZodDto(DbTableInfoSchema) {}

export const CodegenColumnResponseSchema = z.object({
  id: z.number().int().describe('自增 ID'),
  tableId: z.number().int().describe('所属生成表配置 ID'),
  columnName: z.string().describe('数据库列名称'),
  dataType: z.string().describe('数据库数据类型'),
  columnComment: z.string().describe('列中文备注说明'),
  nullable: z.boolean().describe('是否允许为 null'),
  primaryKey: z.boolean().describe('是否为主键'),
  autoIncrement: z.boolean().describe('是否自增'),
  tsType: z.string().describe('生成 TypeScript 类型'),
  prismaType: z.string().describe('Prisma schema 类型'),
  crud: z.boolean().describe('是否作为 CRUD 接口属性'),
  listOperation: z.boolean().describe('是否作为列表查询过滤项'),
  listOperationCondition: z.string().describe('查询过滤条件 (如: =, LIKE)'),
  formOperation: z.boolean().describe('是否作为表单操作属性'),
  htmlType: z.string().describe('前端 HTML 控件类型'),
  dictType: z.string().nullable().describe('引用的字典类型'),
});

export const CodegenTableResponseSchema = z.object({
  id: z.number().int().describe('生成表配置 ID'),
  tableName: z.string().describe('表名称'),
  tableComment: z.string().describe('表说明'),
  className: z.string().describe('生成的 TypeScript 类名'),
  moduleName: z.string().describe('生成的模块名'),
  businessName: z.string().describe('生成的业务名'),
  classComment: z.string().describe('类中文描述说明'),
  author: z.string().describe('作者名'),
  createdAt: z.string().describe('创建时间'),
  updatedAt: z.string().describe('更新时间'),
  columns: z.array(CodegenColumnResponseSchema).optional().describe('字段列详细配置列表'),
});
export class CodegenTableResponseDto extends createZodDto(CodegenTableResponseSchema) {}

export const CodegenCodePreviewSchema = z.object({
  filename: z.string().describe('生成的代码文件相对路径 (e.g. src/modules/system/posts.controller.ts)'),
  code: z.string().describe('生成的完整源码正文'),
});
export class CodegenCodePreviewResponseDto extends createZodDto(CodegenCodePreviewSchema) {}

export const CodegenWriteResultSchema = z.object({
  success: z.boolean().describe('是否同步成功'),
  writtenFiles: z.array(z.string()).describe('成功写入磁盘的文件列表'),
});
export class CodegenWriteResultResponseDto extends createZodDto(CodegenWriteResultSchema) {}
