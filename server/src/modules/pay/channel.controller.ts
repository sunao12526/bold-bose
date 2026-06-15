import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PayChannelService } from './channel.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CommonStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/channel')
export class PayChannelController {
  constructor(private channelService: PayChannelService) {}

  @Post()
  @RequirePermissions('pay:app:update')
  @Log({ module: '支付应用', type: 'UPDATE', description: '配置支付通道' })
  async createOrUpdate(
    @Body('appId', ParseIntPipe) appId: number,
    @Body('code') code: string,
    @Body('config') config: any,
    @Body('status') status?: CommonStatus,
    @Body('remark') remark?: string,
  ) {
    return this.channelService.createOrUpdate({
      appId,
      code,
      config,
      status,
      remark,
    });
  }

  @Get('app/:appId')
  @RequirePermissions('pay:app:query')
  async findByApp(@Param('appId', ParseIntPipe) appId: number) {
    return this.channelService.findByApp(appId);
  }

  @Get(':appId/:code')
  @RequirePermissions('pay:app:query')
  async findChannel(
    @Param('appId', ParseIntPipe) appId: number,
    @Param('code') code: string,
  ) {
    return this.channelService.findChannel(appId, code);
  }

  @Delete(':id')
  @RequirePermissions('pay:app:update')
  @Log({ module: '支付应用', type: 'DELETE', description: '删除支付通道' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.remove(id);
  }
}
