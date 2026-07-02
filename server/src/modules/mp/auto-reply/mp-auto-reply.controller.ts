import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpAutoReplyService } from './mp-auto-reply.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { AutoReplyQueryDto } from '../dto/auto-reply-query.dto';
import { CreateMpAutoReplyDto, UpdateMpAutoReplyDto } from '../dto/mp-input.dto';
import { MpAutoReplyResponseDto, MpAutoReplyListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 自动回复')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/auto-reply')
export class MpAutoReplyController {
  constructor(private service: MpAutoReplyService) {}

  @Post()
  @RequirePermissions('mp:auto-reply:create')
  @Log({ module: '自动回复', type: 'CREATE', description: '创建自动回复' })
  @ApiOperation({ summary: '创建微信公众号自动回复规则' })
  @ApiOkResponse({ type: MpAutoReplyResponseDto })
  async create(@Body() data: CreateMpAutoReplyDto) { return this.service.create(data); }

  @Get()
  @RequirePermissions('mp:auto-reply:query')
  @ApiOperation({ summary: '根据条件分页查询自动回复规则列表' })
  @ApiOkResponse({ type: MpAutoReplyListResponseDto })
  async findAll(@Query() query: AutoReplyQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:auto-reply:query')
  @ApiOperation({ summary: '根据 ID 获取自动回复规则详情' })
  @ApiOkResponse({ type: MpAutoReplyResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:auto-reply:update')
  @Log({ module: '自动回复', type: 'UPDATE', description: '修改自动回复' })
  @ApiOperation({ summary: '修改微信公众号自动回复规则' })
  @ApiOkResponse({ type: MpAutoReplyResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMpAutoReplyDto) { return this.service.update(id, data); }

  @Delete(':id')
  @RequirePermissions('mp:auto-reply:delete')
  @Log({ module: '自动回复', type: 'DELETE', description: '删除自动回复' })
  @ApiOperation({ summary: '删除微信公众号自动回复规则' })
  @ApiOkResponse({ type: MpAutoReplyResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}

