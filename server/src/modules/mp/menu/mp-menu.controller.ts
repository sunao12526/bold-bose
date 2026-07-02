import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpMenuService } from './mp-menu.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { MenuQueryDto } from '../dto/menu-query.dto';
import { CreateMpMenuDto, UpdateMpMenuDto } from '../dto/mp-input.dto';
import { MpMenuResponseDto, MpMenuListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 菜单管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/menu')
export class MpMenuController {
  constructor(private service: MpMenuService) {}

  @Post()
  @RequirePermissions('mp:menu:create')
  @Log({ module: '公众号菜单', type: 'CREATE', description: '创建菜单' })
  @ApiOperation({ summary: '创建微信公众号菜单' })
  @ApiOkResponse({ type: MpMenuResponseDto })
  async create(@Body() data: CreateMpMenuDto) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:menu:query')
  @ApiOperation({ summary: '查询指定公众号菜单列表' })
  @ApiOkResponse({ type: MpMenuListResponseDto })
  async findAll(@Query() query: MenuQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:menu:query')
  @ApiOperation({ summary: '根据 ID 获取菜单详情' })
  @ApiOkResponse({ type: MpMenuResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:menu:update')
  @Log({ module: '公众号菜单', type: 'UPDATE', description: '修改菜单' })
  @ApiOperation({ summary: '更新微信公众号菜单属性' })
  @ApiOkResponse({ type: MpMenuResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMpMenuDto) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:menu:delete')
  @Log({ module: '公众号菜单', type: 'DELETE', description: '删除菜单' })
  @ApiOperation({ summary: '删除微信公众号菜单项' })
  @ApiOkResponse({ type: MpMenuResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  @Post('publish')
  @RequirePermissions('mp:menu:create')
  @Log({ module: '公众号菜单', type: 'UPDATE', description: '下发菜单到微信' })
  @ApiOperation({ summary: '一键把本地自定义菜单发布到微信服务器生效' })
  async publish(@Query('accountId', ParseIntPipe) accountId: number) {
    await this.service.publishMenu(accountId);
    return { data: true };
  }

  @Post('sync')
  @RequirePermissions('mp:menu:create')
  @Log({ module: '公众号菜单', type: 'UPDATE', description: '同步微信端菜单' })
  @ApiOperation({ summary: '从微信服务器拉取菜单配置到本地' })
  async sync(@Query('accountId', ParseIntPipe) accountId: number) {
    await this.service.syncMenu(accountId);
    return { data: true };
  }
}

