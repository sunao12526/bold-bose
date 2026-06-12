import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CodegenService } from './codegen.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/codegen')
export class CodegenController {
  constructor(private readonly codegenService: CodegenService) {}

  @Get('db-tables')
  @RequirePermissions('infra:codegen:query')
  async getDbTables() {
    return this.codegenService.getDbTables();
  }

  @Post('import')
  @RequirePermissions('infra:codegen:create')
  @Log({ module: '代码生成', type: 'CREATE', description: '导入数据库表结构' })
  async importTables(@Body('tableNames') tableNames: string[], @Body('author') author?: string) {
    await this.codegenService.importTables(tableNames, author);
    return { success: true };
  }

  @Get()
  @RequirePermissions('infra:codegen:query')
  async findAll() {
    return this.codegenService.findAllTables();
  }

  @Get(':id')
  @RequirePermissions('infra:codegen:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.findOneTable(id);
  }

  @Put(':id')
  @RequirePermissions('infra:codegen:update')
  @Log({ module: '代码生成', type: 'UPDATE', description: '修改生成表配置' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.codegenService.updateTableMetadata(id, data);
  }

  @Delete(':id')
  @RequirePermissions('infra:codegen:delete')
  @Log({ module: '代码生成', type: 'DELETE', description: '删除导入表配置' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.removeTable(id);
  }

  @Get('preview/:id')
  @RequirePermissions('infra:codegen:query')
  async preview(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.generateCodePreview(id);
  }

  @Post('write/:id')
  @RequirePermissions('infra:codegen:create')
  @Log({ module: '代码生成', type: 'CREATE', description: '同步写入代码到磁盘' })
  async writeCode(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.writeCodeToDisk(id);
  }
}
