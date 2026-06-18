import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpMenuService } from './mp-menu.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { MenuQueryDto } from '../dto/menu-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/menu')
export class MpMenuController {
  constructor(private service: MpMenuService) {}

  @Post()
  @RequirePermissions('mp:menu:create')
  @Log({ module: '公众号菜单', type: 'CREATE', description: '创建菜单' })
  async create(@Body() data: any) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:menu:query')
  async findAll(@Query() query: MenuQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:menu:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:menu:update')
  @Log({ module: '公众号菜单', type: 'UPDATE', description: '修改菜单' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:menu:delete')
  @Log({ module: '公众号菜单', type: 'DELETE', description: '删除菜单' })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
