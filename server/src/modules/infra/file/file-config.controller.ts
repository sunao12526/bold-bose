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
import { FileConfigService } from './file-config.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { CreateFileConfigDto, UpdateFileConfigDto } from '../dto/file-input.dto';
import { FileConfigResponseDto } from '../dto/file-response.dto';

@ApiTags('基础设施 - 文件存储配置')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/file-config')
export class FileConfigController {
  constructor(private fileConfigService: FileConfigService) {}

  @Post()
  @RequirePermissions('infra:file-config:create')
  @ApiOperation({ summary: '创建文件配置' })
  @ApiOkResponse({ type: FileConfigResponseDto })
  async create(@Body() data: CreateFileConfigDto) {
    return this.fileConfigService.create(data);
  }

  @Get()
  @RequirePermissions('infra:file-config:query')
  @ApiOperation({ summary: '获取所有文件配置列表' })
  @ApiOkResponse({ type: FileConfigResponseDto, isArray: true })
  async findAll() {
    return this.fileConfigService.findAll();
  }

  @Get(':id')
  @RequirePermissions('infra:file-config:query')
  @ApiOperation({ summary: '根据 ID 获取文件配置详情' })
  @ApiOkResponse({ type: FileConfigResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fileConfigService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('infra:file-config:update')
  @ApiOperation({ summary: '修改文件配置' })
  @ApiOkResponse({ type: FileConfigResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateFileConfigDto) {
    return this.fileConfigService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('infra:file-config:delete')
  @ApiOperation({ summary: '删除文件配置' })
  @ApiOkResponse({ type: FileConfigResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.fileConfigService.remove(id);
  }

  @Put(':id/set-master')
  @RequirePermissions('infra:file-config:update')
  @ApiOperation({ summary: '设置为主存储配置' })
  @ApiOkResponse({ type: FileConfigResponseDto })
  async setMaster(@Param('id', ParseIntPipe) id: number) {
    return this.fileConfigService.setMaster(id);
  }
}

