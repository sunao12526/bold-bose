import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { TagQueryDto } from '../dto/tag-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  @RequirePermissions('cms:tag:create')
  @Log({ module: 'CMS标签', type: 'CREATE', description: '创建标签' })
  async create(@Body() data: any) {
    return this.tagService.create(data);
  }

  @Get()
  @RequirePermissions('cms:tag:query')
  async findAll(@Query() query: TagQueryDto) {
    return this.tagService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:tag:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:tag:update')
  @Log({ module: 'CMS标签', type: 'UPDATE', description: '修改标签' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.tagService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:tag:delete')
  @Log({ module: 'CMS标签', type: 'DELETE', description: '删除标签' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
