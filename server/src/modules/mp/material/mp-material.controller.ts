import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpMaterialService } from './mp-material.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { MaterialQueryDto } from '../dto/material-query.dto';
import { CreateMpMaterialDto, UpdateMpMaterialDto } from '../dto/mp-input.dto';
import { MpMaterialResponseDto, MpMaterialListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 素材管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/material')
export class MpMaterialController {
  constructor(private service: MpMaterialService) {}

  @Post()
  @RequirePermissions('mp:material:create')
  @Log({ module: '素材管理', type: 'CREATE', description: '创建素材' })
  @ApiOperation({ summary: '添加公众号素材' })
  @ApiOkResponse({ type: MpMaterialResponseDto })
  async create(@Body() data: CreateMpMaterialDto) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:material:query')
  @ApiOperation({ summary: '根据条件分页查询素材列表' })
  @ApiOkResponse({ type: MpMaterialListResponseDto })
  async findAll(@Query() query: MaterialQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:material:query')
  @ApiOperation({ summary: '根据 ID 获取素材详情' })
  @ApiOkResponse({ type: MpMaterialResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:material:update')
  @Log({ module: '素材管理', type: 'UPDATE', description: '修改素材' })
  @ApiOperation({ summary: '修改素材元数据信息' })
  @ApiOkResponse({ type: MpMaterialResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMpMaterialDto) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:material:delete')
  @Log({ module: '素材管理', type: 'DELETE', description: '删除素材' })
  @ApiOperation({ summary: '删除公众号素材' })
  @ApiOkResponse({ type: MpMaterialResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}

