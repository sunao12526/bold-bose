import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PropertyService } from './property.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Post()
  @RequirePermissions('mall:property:create')
  @Log({ module: '商品规格', type: 'CREATE', description: '创建规格属性' })
  async create(@Body() data: any) {
    return this.propertyService.create(data);
  }

  @Get()
  @RequirePermissions('mall:property:query')
  async findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  @RequirePermissions('mall:property:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:property:update')
  @Log({ module: '商品规格', type: 'UPDATE', description: '修改规格属性' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.propertyService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:property:delete')
  @Log({ module: '商品规格', type: 'DELETE', description: '删除规格属性' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.remove(id);
  }
}
