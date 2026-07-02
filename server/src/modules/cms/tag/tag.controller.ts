import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { TagQueryDto } from '../dto/tag-query.dto';
import { CreateTagDto, UpdateTagDto } from '../dto/tag-input.dto';
import { TagResponseDto, TagListResponseDto } from '../dto/tag-response.dto';

@ApiTags('CMS - 标签管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  @RequirePermissions('cms:tag:create')
  @Log({ module: 'CMS标签', type: 'CREATE', description: '创建标签' })
  @ApiOperation({ summary: '创建标签' })
  @ApiOkResponse({ type: TagResponseDto })
  async create(@Body() data: CreateTagDto) {
    return this.tagService.create(data);
  }

  @Get()
  @RequirePermissions('cms:tag:query')
  @ApiOperation({ summary: '分页查询标签列表' })
  @ApiOkResponse({ type: TagListResponseDto })
  async findAll(@Query() query: TagQueryDto) {
    return this.tagService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:tag:query')
  @ApiOperation({ summary: '根据 ID 获取标签详情' })
  @ApiOkResponse({ type: TagResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:tag:update')
  @Log({ module: 'CMS标签', type: 'UPDATE', description: '修改标签' })
  @ApiOperation({ summary: '修改标签' })
  @ApiOkResponse({ type: TagResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTagDto) {
    return this.tagService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:tag:delete')
  @Log({ module: 'CMS标签', type: 'DELETE', description: '删除标签' })
  @ApiOperation({ summary: '删除标签' })
  @ApiOkResponse({ type: TagResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}

