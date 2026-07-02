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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PayChannelService } from './channel.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreatePayChannelDto } from './dto/pay-input.dto';
import { PayChannelResponseDto } from './dto/pay-response.dto';

@ApiTags('支付中心 - 支付通道')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/channel')
export class PayChannelController {
  constructor(private channelService: PayChannelService) {}

  @Post()
  @RequirePermissions('pay:app:update')
  @Log({ module: '支付应用', type: 'UPDATE', description: '配置支付通道' })
  @ApiOperation({ summary: '创建或修改支付应用通道配置' })
  @ApiOkResponse({ type: PayChannelResponseDto })
  async createOrUpdate(
    @Body() data: CreatePayChannelDto,
  ) {
    return this.channelService.createOrUpdate(data);
  }

  @Get('app/:appId')
  @RequirePermissions('pay:app:query')
  @ApiOperation({ summary: '根据应用 ID 查询已配置的所有支付通道' })
  @ApiOkResponse({ type: PayChannelResponseDto, isArray: true })
  async findByApp(@Param('appId', ParseIntPipe) appId: number) {
    return this.channelService.findByApp(appId);
  }

  @Get(':appId/:code')
  @RequirePermissions('pay:app:query')
  @ApiOperation({ summary: '获取指定应用及通道编码的通道配置详情' })
  @ApiOkResponse({ type: PayChannelResponseDto })
  async findChannel(
    @Param('appId', ParseIntPipe) appId: number,
    @Param('code') code: string,
  ) {
    return this.channelService.findChannel(appId, code);
  }

  @Delete(':id')
  @RequirePermissions('pay:app:update')
  @Log({ module: '支付应用', type: 'DELETE', description: '删除支付通道' })
  @ApiOperation({ summary: '删除已配置的支付通道' })
  @ApiOkResponse({ type: PayChannelResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.remove(id);
  }
}

