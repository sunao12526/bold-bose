import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpAutoReplyService } from './mp-auto-reply.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { AutoReplyQueryDto } from '../dto/auto-reply-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/auto-reply')
export class MpAutoReplyController {
  constructor(private service: MpAutoReplyService) {}

  @Post()
  @RequirePermissions('mp:auto-reply:create')
  @Log({ module: '自动回复', type: 'CREATE', description: '创建自动回复' })
  async create(@Body() data: any) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:auto-reply:query')
  async findAll(@Query() query: AutoReplyQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:auto-reply:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:auto-reply:update')
  @Log({ module: '自动回复', type: 'UPDATE', description: '修改自动回复' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:auto-reply:delete')
  @Log({ module: '自动回复', type: 'DELETE', description: '删除自动回复' })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
