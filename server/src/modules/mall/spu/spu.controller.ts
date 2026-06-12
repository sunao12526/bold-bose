import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SpuService } from './spu.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/spu')
export class SpuController {
  constructor(private spuService: SpuService) {}

  @Post()
  @RequirePermissions('mall:spu:create')
  @Log({ module: '商品管理', type: 'CREATE', description: '创建商品' })
  async create(@Body() data: any) {
    return this.spuService.create(data);
  }

  @Get()
  @RequirePermissions('mall:spu:query')
  async findAll() {
    return this.spuService.findAll();
  }

  @Get(':id')
  @RequirePermissions('mall:spu:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spuService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:spu:update')
  @Log({ module: '商品管理', type: 'UPDATE', description: '修改商品' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.spuService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:spu:delete')
  @Log({ module: '商品管理', type: 'DELETE', description: '删除商品' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.spuService.remove(id);
  }
}
