import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CodegenService {
  constructor(private prisma: PrismaService) {}

  // 1. Get raw database tables
  async getDbTables(): Promise<any[]> {
    // List tables in public schema, excluding internal ones
    const tables: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        c.relname AS "tableName",
        COALESCE(obj_description(c.oid, 'pg_class'), '') AS "tableComment"
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' 
        AND c.relkind = 'r'
        AND c.relname NOT LIKE '_prisma%'
        AND c.relname NOT LIKE 'infra_codegen%'
      ORDER BY c.relname;
    `);

    // Filter out tables that are already imported
    const importedTables = await this.prisma.codegenTable.findMany({
      select: { tableName: true },
    });
    const importedNames = new Set(importedTables.map((t) => t.tableName));

    return tables.filter((t) => !importedNames.has(t.tableName));
  }

  // 2. Import tables and auto-generate fields configuration metadata
  async importTables(
    tableNames: string[],
    author: string = 'Antigravity',
  ): Promise<void> {
    for (const tableName of tableNames) {
      // Fetch table comment
      const tableInfo: any[] = await this.prisma.$queryRawUnsafe(
        `
        SELECT 
          c.relname AS "tableName",
          COALESCE(obj_description(c.oid, 'pg_class'), '') AS "tableComment"
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = $1;
      `,
        tableName,
      );

      if (tableInfo.length === 0) {
        throw new NotFoundException(`数据库表 ${tableName} 未找到`);
      }

      const tableComment = tableInfo[0].tableComment || tableName;

      // Extract moduleName and businessName
      const parts = tableName.split('_');
      let moduleName = 'system';
      let businessName = tableName;
      if (parts.length > 1) {
        moduleName = parts[0];
        businessName = parts.slice(1).join('_');
      }

      // Convert snake_case to PascalCase for Class Name
      const className = businessName
        .split('_')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');

      const classComment = tableComment.replace(/表$/, '') || className;

      // Save CodegenTable
      const codegenTable = await this.prisma.codegenTable.create({
        data: {
          tableName,
          tableComment,
          className,
          moduleName,
          businessName,
          classComment,
          author,
        },
      });

      // Fetch Columns metadata from PG catalog
      const columns: any[] = await this.prisma.$queryRawUnsafe(
        `
        SELECT 
          a.attname AS "columnName",
          format_type(a.atttypid, a.atttypmod) AS "dataType",
          a.attnotnull = false AS "nullable",
          COALESCE(
            (SELECT true FROM pg_index i WHERE i.indrelid = c.oid AND i.indisprimary AND a.attnum = ANY(i.indkey)),
            false
          ) AS "primaryKey",
          COALESCE(pg_get_expr(ad.adbin, ad.adrelid) LIKE 'nextval(%', false) AS "autoIncrement",
          COALESCE(col_description(c.oid, a.attnum), '') AS "columnComment"
        FROM pg_attribute a
        JOIN pg_class c ON c.oid = a.attrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_attrdef ad ON ad.adrelid = c.oid AND ad.adnum = a.attnum
        WHERE n.nspname = 'public' 
          AND c.relname = $1
          AND a.attnum > 0 
          AND NOT a.attisdropped
        ORDER BY a.attnum;
      `,
        tableName,
      );

      // Save CodegenColumns
      for (const col of columns) {
        const mappedTypes = this.mapPostgresType(col.dataType, col.columnName);
        const defaults = this.getDefaultHtmlType(
          col.columnName,
          mappedTypes.tsType,
          col.primaryKey,
        );

        await this.prisma.codegenColumn.create({
          data: {
            tableId: codegenTable.id,
            columnName: col.columnName,
            dataType: col.dataType,
            columnComment: col.columnComment || col.columnName,
            nullable: col.nullable,
            primaryKey: col.primaryKey,
            autoIncrement: col.autoIncrement,
            tsType: mappedTypes.tsType,
            prismaType: mappedTypes.prismaType,
            crud: ![
              'id',
              'created_at',
              'updated_at',
              'createdAt',
              'updatedAt',
            ].includes(col.columnName),
            listOperation: !['password', 'secret_key'].includes(col.columnName),
            listOperationCondition: '=',
            formOperation:
              ![
                'id',
                'created_at',
                'updated_at',
                'createdAt',
                'updatedAt',
                'autoIncrement',
              ].includes(col.columnName) && !col.autoIncrement,
            htmlType: defaults.htmlType,
            dictType: defaults.dictType,
          },
        });
      }
    }
  }

  // 3. Helper to map PG type to TS/Prisma type
  private mapPostgresType(
    dataType: string,
    columnName: string,
  ): { tsType: string; prismaType: string } {
    const type = dataType.toLowerCase();

    if (type.includes('bool')) {
      return { tsType: 'boolean', prismaType: 'Boolean' };
    }
    if (
      type.includes('int') ||
      type.includes('serial') ||
      type.includes('float') ||
      type.includes('double') ||
      type.includes('numeric') ||
      type.includes('decimal') ||
      type.includes('real')
    ) {
      return {
        tsType: 'number',
        prismaType:
          type.includes('int') || type.includes('serial') ? 'Int' : 'Float',
      };
    }
    if (
      type.includes('date') ||
      type.includes('time') ||
      type.includes('timestamp')
    ) {
      return { tsType: 'Date', prismaType: 'DateTime' };
    }
    return { tsType: 'string', prismaType: 'String' };
  }

  // 4. Helper to map default html inputs
  private getDefaultHtmlType(
    columnName: string,
    tsType: string,
    isPrimaryKey: boolean,
  ): { htmlType: string; dictType: string | null } {
    if (isPrimaryKey) {
      return { htmlType: 'input', dictType: null };
    }
    const name = columnName.toLowerCase();
    if (name === 'status') {
      return { htmlType: 'select', dictType: 'sys_common_status' };
    }
    if (name.includes('password')) {
      return { htmlType: 'input', dictType: null }; // handled by form as input.password
    }
    if (
      name.includes('remark') ||
      name.includes('content') ||
      name.includes('description') ||
      name.includes('memo')
    ) {
      return { htmlType: 'textarea', dictType: null };
    }
    if (
      name.includes('time') ||
      name.includes('date') ||
      name.endsWith('_at') ||
      name.startsWith('at_')
    ) {
      return { htmlType: 'date', dictType: null };
    }
    if (tsType === 'boolean') {
      return { htmlType: 'switch', dictType: null };
    }
    if (tsType === 'number') {
      return { htmlType: 'number', dictType: null };
    }
    return { htmlType: 'input', dictType: null };
  }

  // 5. Get imported tables metadata
  async findAllTables() {
    return this.prisma.codegenTable.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOneTable(id: number) {
    const table = await this.prisma.codegenTable.findUnique({
      where: { id },
      include: { columns: { orderBy: { id: 'asc' } } },
    });
    if (!table) throw new NotFoundException('导入表记录不存在');
    return table;
  }

  // 6. Update table and columns metadata
  async updateTableMetadata(id: number, data: any) {
    const { columns, ...tableData } = data;

    // Update main table settings
    await this.prisma.codegenTable.update({
      where: { id },
      data: tableData,
    });

    // Update columns settings
    if (columns && Array.isArray(columns)) {
      for (const col of columns) {
        const { id: colId, tableId, columnName, dataType, ...colData } = col;
        await this.prisma.codegenColumn.update({
          where: { id: colId },
          data: colData,
        });
      }
    }

    return this.findOneTable(id);
  }

  // 7. Delete imported table metadata
  async removeTable(id: number) {
    return this.prisma.codegenTable.delete({ where: { id } });
  }

  // 8. Generate codes preview
  async generateCodePreview(tableId: number): Promise<any[]> {
    const table = await this.findOneTable(tableId);

    const controllerCode = this.renderController(table);
    const serviceCode = this.renderService(table);
    const moduleCode = this.renderModule(table);
    const frontendPageCode = this.renderFrontendPage(table);

    const prefixPath = `server/src/modules/${table.moduleName}/${table.businessName}`;
    const frontendPrefixPath = `admin/src/app/(dashboard)/${table.moduleName}/${table.businessName}`;

    return [
      {
        name: `${table.businessName}.controller.ts`,
        path: `${prefixPath}/${table.businessName}.controller.ts`,
        language: 'typescript',
        content: controllerCode,
      },
      {
        name: `${table.businessName}.service.ts`,
        path: `${prefixPath}/${table.businessName}.service.ts`,
        language: 'typescript',
        content: serviceCode,
      },
      {
        name: `${table.businessName}.module.ts`,
        path: `${prefixPath}/${table.businessName}.module.ts`,
        language: 'typescript',
        content: moduleCode,
      },
      {
        name: `page.tsx`,
        path: `${frontendPrefixPath}/page.tsx`,
        language: 'typescript',
        content: frontendPageCode,
      },
    ];
  }

  // 9. Write generated files directly into codebase
  async writeCodeToDisk(
    tableId: number,
  ): Promise<{ success: boolean; files: string[]; parentRegistered: boolean }> {
    const preview = await this.generateCodePreview(tableId);
    const table = await this.findOneTable(tableId);
    const filesWritten: string[] = [];

    // Base Workspace directory (resolved from process.cwd() or parent folder)
    const baseDir = path.resolve(process.cwd(), '..'); // process.cwd() is inside 'server/' since NestJS executes there.

    for (const file of preview) {
      const fullPath = path.join(baseDir, file.path);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, file.content, 'utf8');
      filesWritten.push(file.path);
    }

    // Attempt to auto-register module in parent module file (e.g. system.module.ts)
    let parentRegistered = false;
    try {
      parentRegistered = await this.registerInParentModule(
        baseDir,
        table.moduleName,
        table.businessName,
        table.className,
      );
    } catch (err) {
      console.error('Failed to auto register in parent module:', err);
    }

    return {
      success: true,
      files: filesWritten,
      parentRegistered,
    };
  }

  // 10. Auto-register in parent module helper
  private async registerInParentModule(
    baseDir: string,
    moduleName: string,
    businessName: string,
    className: string,
  ): Promise<boolean> {
    const parentModulePath = path.join(
      baseDir,
      'server/src/modules',
      moduleName,
      `${moduleName}.module.ts`,
    );
    if (!fs.existsSync(parentModulePath)) return false;

    let content = fs.readFileSync(parentModulePath, 'utf8');
    const moduleImportName = `${className}Module`;
    const importPath = `./${businessName}/${businessName}.module`;

    // 1. Check if already imported
    if (content.includes(moduleImportName)) {
      return true; // Already registered
    }

    // 2. Add Import statement at the top
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex === -1) return false;

    const endOfLastImportLine = content.indexOf('\n', lastImportIndex);
    const importStatement = `\nimport { ${moduleImportName} } from '${importPath}';`;

    content =
      content.slice(0, endOfLastImportLine) +
      importStatement +
      content.slice(endOfLastImportLine);

    // 3. Find imports array in @Module, or create it if not present
    const moduleDecoratorRegex = /@Module\s*\(\s*\{([\s\S]*?)\}\s*\)/;
    const match = content.match(moduleDecoratorRegex);
    if (!match) return false;

    const moduleProps = match[1];

    if (moduleProps.includes('imports:')) {
      // Append moduleImportName to existing imports array
      const importsRegex = /(imports\s*:\s*\[)([\s\S]*?)(\])/;
      content = content.replace(importsRegex, (m, p1, p2, p3) => {
        const trimmed = p2.trim();
        const comma = trimmed.length > 0 && !trimmed.endsWith(',') ? ',' : '';
        return `${p1}${trimmed}${comma} ${moduleImportName}${p3}`;
      });
    } else {
      // Add imports property to @Module
      const firstPropIndex = content.indexOf('{', match.index);
      content =
        content.slice(0, firstPropIndex + 1) +
        `\n  imports: [${moduleImportName}],` +
        content.slice(firstPropIndex + 1);
    }

    fs.writeFileSync(parentModulePath, content, 'utf8');
    return true;
  }

  // --- Backend Code Rendering Templates ---

  private renderController(table: any): string {
    const { moduleName, businessName, className, classComment } = table;

    return `import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ${className}Service } from './${businessName}.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('${moduleName}/${businessName}')
export class ${className}Controller {
  constructor(private readonly service: ${className}Service) {}

  @Post()
  @RequirePermissions('${moduleName}:${businessName}:create')
  @Log({ module: '${classComment}', type: 'CREATE', description: '创建${classComment}' })
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('${moduleName}:${businessName}:query')
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('${moduleName}:${businessName}:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('${moduleName}:${businessName}:update')
  @Log({ module: '${classComment}', type: 'UPDATE', description: '修改${classComment}' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('${moduleName}:${businessName}:delete')
  @Log({ module: '${classComment}', type: 'DELETE', description: '删除${classComment}' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
`;
  }

  private renderService(table: any): string {
    const { className } = table;
    const camelClassName =
      className.charAt(0).toLowerCase() + className.slice(1);

    // Build filter expressions based on CodegenColumns
    let filterLogics = '';
    const searchColumns = table.columns.filter(
      (c: any) => c.listOperation && !c.primaryKey,
    );

    for (const col of searchColumns) {
      const field = col.columnName;
      if (col.listOperationCondition === 'LIKE') {
        filterLogics += `    if (query?.${field}) {
      where.${field} = { contains: query.${field}, mode: 'insensitive' };
    }\n`;
      } else {
        filterLogics += `    if (query?.${field}) {
      where.${field} = query.${field};\n    }\n`;
      }
    }

    return `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class ${className}Service {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return (this.prisma as any).${camelClassName}.create({ data });
  }

  async findAll(query?: any) {
    const where: any = {};
${filterLogics}
    return (this.prisma as any).${camelClassName}.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const record = await (this.prisma as any).${camelClassName}.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('数据记录不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return (this.prisma as any).${camelClassName}.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return (this.prisma as any).${camelClassName}.delete({ where: { id } });
  }
}
`;
  }

  private renderModule(table: any): string {
    const { className, businessName } = table;
    return `import { Module } from '@nestjs/common';
import { ${className}Service } from './${businessName}.service';
import { ${className}Controller } from './${businessName}.controller';

@Module({
  controllers: [${className}Controller],
  providers: [${className}Service],
  exports: [${className}Service],
})
export class ${className}Module {}
`;
  }

  // --- Frontend Code Rendering Template ---

  private renderFrontendPage(table: any): string {
    const { moduleName, businessName, className, classComment } = table;
    const resourcePath = `${moduleName}/${businessName}`;

    // Columns definitions
    let listColumnsText = '';
    let formsItemsText = '';
    const refSelectsProps = '';
    let refSelectHooks = '';
    const formRefResets = '';

    const listCols = table.columns.filter((c: any) => c.listOperation);
    const formCols = table.columns.filter((c: any) => c.formOperation);

    for (const col of listCols) {
      const field = col.columnName;
      const title = col.columnComment || field;

      if (field === 'id') {
        listColumnsText += `          <Table.Column dataIndex="id" title="ID" width={80} />\n`;
      } else if (col.dictType) {
        listColumnsText += `          <Table.Column 
            dataIndex="${field}" 
            title="${title}" 
            render={(val: string) => (
              <Tag color={val === 'ENABLE' ? 'green' : 'red'}>{val === 'ENABLE' ? '启用' : '禁用'}</Tag>
            )}
          />\n`;
      } else if (col.tsType === 'boolean') {
        listColumnsText += `          <Table.Column 
            dataIndex="${field}" 
            title="${title}" 
            render={(val: boolean) => <Tag color={val ? 'blue' : 'gray'}>{val ? '是' : '否'}</Tag>}
          />\n`;
      } else if (col.tsType === 'Date') {
        listColumnsText += `          <Table.Column 
            dataIndex="${field}" 
            title="${title}" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />\n`;
      } else {
        listColumnsText += `          <Table.Column dataIndex="${field}" title="${title}" ellipsis />\n`;
      }
    }

    // Build form fields
    for (const col of formCols) {
      const field = col.columnName;
      const title = col.columnComment || field;
      const requiredRule = col.nullable
        ? ''
        : `rules={[{ required: true, message: '请输入${title}' }]}`;

      if (col.dictType) {
        const selectHookName = `${field}SelectProps`;
        refSelectHooks += `  const { selectProps: ${selectHookName} } = useSelect({
    resource: 'system/dict-data',
    optionLabel: 'label',
    optionValue: 'value',
    filters: [{ field: 'dictType', operator: 'eq', value: '${col.dictType}' }],
  });\n\n`;

        formsItemsText += `          <Form.Item name="${field}" label="${title}" ${requiredRule} initialValue="ENABLE">
            <Select placeholder="请选择${title}" {...${selectHookName}} />
          </Form.Item>\n\n`;
      } else if (col.htmlType === 'switch') {
        formsItemsText += `          <Form.Item name="${field}" label="${title}" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>\n\n`;
      } else if (col.htmlType === 'textarea') {
        formsItemsText += `          <Form.Item name="${field}" label="${title}" ${requiredRule}>
            <Input.TextArea rows={3} placeholder="请输入${title}" />
          </Form.Item>\n\n`;
      } else if (col.htmlType === 'number' || col.tsType === 'number') {
        formsItemsText += `          <Form.Item name="${field}" label="${title}" ${requiredRule}>
            <Input type="number" placeholder="请输入${title}" />
          </Form.Item>\n\n`;
      } else {
        formsItemsText += `          <Form.Item name="${field}" label="${title}" ${requiredRule}>
            <Input placeholder="请输入${title}" />
          </Form.Item>\n\n`;
      }
    }

    return `'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Switch } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function ${className}List() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: '${resourcePath}',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  // Load Dictionary Option Select Props
${refSelectHooks}
  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.resetFields();
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const { onFinish, formLoading } = useForm({
    resource: '${resourcePath}',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
${listColumnsText}          <Table.Column
            title="操作"
            dataIndex="actions"
            width={120}
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增${classComment}' : '编辑${classComment}'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            // Convert numerical inputs
            const payload = { ...values };
            Object.keys(payload).forEach(key => {
              const rules = form.getFieldInstance(key)?.props?.type;
              if (rules === 'number' && payload[key] !== undefined) {
                payload[key] = Number(payload[key]);
              }
            });
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
${formsItemsText}        </Form>
      </Modal>
    </div>
  );
}
`;
  }
}
