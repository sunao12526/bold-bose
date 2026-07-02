import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpTagService } from './mp-tag.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { TagQueryDto } from '../dto/tag-query.dto';
import { CreateMpTagDto, UpdateMpTagDto } from '../dto/mp-input.dto';
import { MpTagResponseDto, MpTagListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 标签管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/tag')
export class MpTagController {
  constructor(private service: MpTagService) {}

  @Post()
  @RequirePermissions('mp:tag:create')
  @Log({ module: '公众号标签', type: 'CREATE', description: '创建标签' })
  @ApiOperation({ summary: '创建微信公众号标签' })
  @ApiOkResponse({ type: MpTagResponseDto })
  async create(@Body() data: CreateMpTagDto) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:tag:query')
  @ApiOperation({ summary: '查询公众号标签列表' })
  @ApiOkResponse({ type: MpTagListResponseDto })
  async findAll(@Query() query: TagQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:tag:query')
  @ApiOperation({ summary: '根据 ID 获取标签详情' })
  @ApiOkResponse({ type: MpTagResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:tag:update')
  @Log({ module: '公众号标签', type: 'UPDATE', description: '修改标签' })
  @ApiOperation({ summary: '修改微信公众号标签' })
  @ApiOkResponse({ type: MpTagResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMpTagDto) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:tag:delete')
  @Log({ module: '公众号标签', type: 'DELETE', description: '删除标签' })
  @ApiOperation({ summary: '删除微信公众号标签' })
  @ApiOkResponse({ type: MpTagResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}

