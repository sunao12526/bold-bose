import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpMessageService } from './mp-message.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

import { MessageQueryDto } from '../dto/message-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/message')
export class MpMessageController {
  constructor(private service: MpMessageService) {}

  @Get()
  @RequirePermissions('mp:message:query')
  async findAll(@Query() query: MessageQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:message:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
}
