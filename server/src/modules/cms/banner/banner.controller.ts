import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BannerService } from './banner.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { BannerQueryDto } from '../dto/banner-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post()
  @RequirePermissions('cms:banner:create')
  @Log({ module: 'CMS轮播图', type: 'CREATE', description: '创建轮播图' })
  async create(@Body() data: any) {
    return this.bannerService.create(data);
  }

  @Get()
  @RequirePermissions('cms:banner:query')
  async findAll(@Query() query: BannerQueryDto) {
    return this.bannerService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:banner:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:banner:update')
  @Log({ module: 'CMS轮播图', type: 'UPDATE', description: '修改轮播图' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.bannerService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:banner:delete')
  @Log({ module: 'CMS轮播图', type: 'DELETE', description: '删除轮播图' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.remove(id);
  }
}
