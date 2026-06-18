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
import { NoticeService } from './notice.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { NoticeQueryDto } from '../dto/notice-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/notice')
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Post()
  @RequirePermissions('system:notice:create')
  @Log({ module: 'system_notice', type: 'CREATE', description: '创建通知公告' })
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('system:notice:query')
  async findAll(@Query() query: NoticeQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:notice:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:notice:update')
  @Log({ module: 'system_notice', type: 'UPDATE', description: '修改通知公告' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:notice:delete')
  @Log({ module: 'system_notice', type: 'DELETE', description: '删除通知公告' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
