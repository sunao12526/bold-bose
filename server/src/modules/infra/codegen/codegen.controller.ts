import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CodegenService } from './codegen.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { ImportTablesDto, UpdateCodegenTableDto } from '../dto/codegen-input.dto';
import {
  DbTableInfoResponseDto,
  CodegenTableResponseDto,
  CodegenCodePreviewResponseDto,
  CodegenWriteResultResponseDto,
} from '../dto/codegen-response.dto';
import { SuccessResponseDto } from '../../auth/dto/auth-response.dto';

@ApiTags('基础设施 - 代码生成器')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/codegen')
export class CodegenController {
  constructor(private readonly codegenService: CodegenService) {}

  @Get('db-tables')
  @RequirePermissions('infra:codegen:query')
  @ApiOperation({ summary: '获取数据库中所有尚未导入配置的物理表列表' })
  @ApiOkResponse({ type: DbTableInfoResponseDto, isArray: true })
  async getDbTables() {
    return this.codegenService.getDbTables();
  }

  @Post('import')
  @RequirePermissions('infra:codegen:create')
  @Log({ module: '代码生成', type: 'CREATE', description: '导入数据库表结构' })
  @ApiOperation({ summary: '导入指定数据库物理表结构以生成配置' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async importTables(
    @Body() body: ImportTablesDto,
  ) {
    await this.codegenService.importTables(body.tableNames, body.author);
    return { success: true };
  }

  @Get()
  @RequirePermissions('infra:codegen:query')
  @ApiOperation({ summary: '查询已导入配置的代码生成物理表列表' })
  @ApiOkResponse({ type: CodegenTableResponseDto, isArray: true })
  async findAll() {
    return this.codegenService.findAllTables();
  }

  @Get(':id')
  @RequirePermissions('infra:codegen:query')
  @ApiOperation({ summary: '根据 ID 查询代码生成物理表配置及字段列详情' })
  @ApiOkResponse({ type: CodegenTableResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.findOneTable(id);
  }

  @Put(':id')
  @RequirePermissions('infra:codegen:update')
  @Log({ module: '代码生成', type: 'UPDATE', description: '修改生成表配置' })
  @ApiOperation({ summary: '修改生成表元数据及字段具体生成策略' })
  @ApiOkResponse({ type: CodegenTableResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCodegenTableDto) {
    return this.codegenService.updateTableMetadata(id, data);
  }

  @Delete(':id')
  @RequirePermissions('infra:codegen:delete')
  @Log({ module: '代码生成', type: 'DELETE', description: '删除导入表配置' })
  @ApiOperation({ summary: '删除已导入的代码生成配置' })
  @ApiOkResponse({ type: CodegenTableResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.removeTable(id);
  }

  @Get('preview/:id')
  @RequirePermissions('infra:codegen:query')
  @ApiOperation({ summary: '预览代码生成内容 (不写入磁盘)' })
  @ApiOkResponse({ type: CodegenCodePreviewResponseDto, isArray: true })
  async preview(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.generateCodePreview(id);
  }

  @Post('write/:id')
  @RequirePermissions('infra:codegen:create')
  @Log({
    module: '代码生成',
    type: 'CREATE',
    description: '同步写入代码到磁盘',
  })
  @ApiOperation({ summary: '将生成的代码同步并物理写入到本地磁盘' })
  @ApiOkResponse({ type: CodegenWriteResultResponseDto })
  async writeCode(@Param('id', ParseIntPipe) id: number) {
    return this.codegenService.writeCodeToDisk(id);
  }
}

