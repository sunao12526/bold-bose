import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpMaterialService } from './mp-material.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/material')
export class MpMaterialController {
  constructor(private service: MpMaterialService) {}

  @Post()
  @RequirePermissions('mp:material:create')
  @Log({ module: '素材管理', type: 'CREATE', description: '创建素材' })
  async create(@Body() data: any) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:material:query')
  async findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:material:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:material:update')
  @Log({ module: '素材管理', type: 'UPDATE', description: '修改素材' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:material:delete')
  @Log({ module: '素材管理', type: 'DELETE', description: '删除素材' })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
