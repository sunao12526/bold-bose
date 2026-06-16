import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpTagService } from './mp-tag.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/tag')
export class MpTagController {
  constructor(private service: MpTagService) {}

  @Post()
  @RequirePermissions('mp:tag:create')
  @Log({ module: '公众号标签', type: 'CREATE', description: '创建标签' })
  async create(@Body() data: any) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:tag:query')
  async findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:tag:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:tag:update')
  @Log({ module: '公众号标签', type: 'UPDATE', description: '修改标签' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:tag:delete')
  @Log({ module: '公众号标签', type: 'DELETE', description: '删除标签' })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
