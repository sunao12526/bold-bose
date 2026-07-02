import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpAccountService } from './mp-account.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CreateMpAccountDto, UpdateMpAccountDto } from '../dto/mp-input.dto';
import { MpAccountResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 账号设置')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/account')
export class MpAccountController {
  constructor(private service: MpAccountService) {}

  @Post()
  @RequirePermissions('mp:account:create')
  @Log({ module: '公众号管理', type: 'CREATE', description: '创建公众号账号' })
  @ApiOperation({ summary: '创建微信公众号账号' })
  @ApiOkResponse({ type: MpAccountResponseDto })
  async create(@Body() data: CreateMpAccountDto) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:account:query')
  @ApiOperation({ summary: '获取全部微信公众号账号列表' })
  @ApiOkResponse({ type: MpAccountResponseDto, isArray: true })
  async findAll() { return this.service.findAll(); }

  @Get(':id')
  @RequirePermissions('mp:account:query')
  @ApiOperation({ summary: '根据 ID 获取微信公众号账号详情' })
  @ApiOkResponse({ type: MpAccountResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:account:update')
  @Log({ module: '公众号管理', type: 'UPDATE', description: '修改公众号账号' })
  @ApiOperation({ summary: '修改微信公众号账号信息' })
  @ApiOkResponse({ type: MpAccountResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMpAccountDto) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:account:delete')
  @Log({ module: '公众号管理', type: 'DELETE', description: '删除公众号账号' })
  @ApiOperation({ summary: '删除指定微信公众号账号' })
  @ApiOkResponse({ type: MpAccountResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}

