import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { BannerQueryDto } from '../dto/banner-query.dto';
import { CreateBannerDto, UpdateBannerDto } from '../dto/banner-input.dto';
import { BannerResponseDto, BannerListResponseDto } from '../dto/banner-response.dto';

@ApiTags('CMS - 轮播图管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Post()
  @RequirePermissions('cms:banner:create')
  @Log({ module: 'CMS轮播图', type: 'CREATE', description: '创建轮播图' })
  @ApiOperation({ summary: '创建轮播图' })
  @ApiOkResponse({ type: BannerResponseDto })
  async create(@Body() data: CreateBannerDto) {
    return this.bannerService.create(data);
  }

  @Get()
  @RequirePermissions('cms:banner:query')
  @ApiOperation({ summary: '分页查询轮播图列表' })
  @ApiOkResponse({ type: BannerListResponseDto })
  async findAll(@Query() query: BannerQueryDto) {
    return this.bannerService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:banner:query')
  @ApiOperation({ summary: '根据 ID 获取轮播图详情' })
  @ApiOkResponse({ type: BannerResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:banner:update')
  @Log({ module: 'CMS轮播图', type: 'UPDATE', description: '修改轮播图' })
  @ApiOperation({ summary: '修改轮播图' })
  @ApiOkResponse({ type: BannerResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateBannerDto) {
    return this.bannerService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:banner:delete')
  @Log({ module: 'CMS轮播图', type: 'DELETE', description: '删除轮播图' })
  @ApiOperation({ summary: '删除轮播图' })
  @ApiOkResponse({ type: BannerResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.remove(id);
  }
}

