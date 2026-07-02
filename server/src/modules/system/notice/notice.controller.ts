import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NoticeService } from './notice.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { NoticeQueryDto } from '../dto/notice-query.dto';
import { CreateNoticeDto, UpdateNoticeDto } from '../dto/notice-input.dto';
import { NoticeResponseDto, NoticeListResponseDto } from '../dto/notice-response.dto';

@ApiTags('系统 - 通知公告')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/notice')
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Post()
  @RequirePermissions('system:notice:create')
  @Log({ module: 'system_notice', type: 'CREATE', description: '创建通知公告' })
  @ApiOperation({ summary: '创建通知公告' })
  @ApiOkResponse({ type: NoticeResponseDto })
  async create(@Body() data: CreateNoticeDto) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('system:notice:query')
  @ApiOperation({ summary: '分页查询通知公告列表' })
  @ApiOkResponse({ type: NoticeListResponseDto })
  async findAll(@Query() query: NoticeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:notice:query')
  @ApiOperation({ summary: '根据 ID 获取通知公告详情' })
  @ApiOkResponse({ type: NoticeResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:notice:update')
  @Log({ module: 'system_notice', type: 'UPDATE', description: '修改通知公告' })
  @ApiOperation({ summary: '修改通知公告' })
  @ApiOkResponse({ type: NoticeResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateNoticeDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:notice:delete')
  @Log({ module: 'system_notice', type: 'DELETE', description: '删除通知公告' })
  @ApiOperation({ summary: '删除通知公告' })
  @ApiOkResponse({ type: NoticeResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

