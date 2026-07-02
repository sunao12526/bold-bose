import { Controller, Get, Post, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MpMessageTemplateService } from './mp-message-template.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@ApiTags('微信公众号 - 模板消息')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/message-template')
export class MpMessageTemplateController {
  constructor(private service: MpMessageTemplateService) {}

  @Get()
  @RequirePermissions('mp:message-template:query')
  @ApiOperation({ summary: '分页/列表查询模板消息' })
  async findAll(@Query('accountId') accountId?: number) {
    const list = await this.service.findAll({ accountId });
    return { data: list };
  }

  @Post('sync')
  @RequirePermissions('mp:message-template:sync')
  @Log({ module: '模板消息', type: 'UPDATE', description: '同步微信消息模板' })
  @ApiOperation({ summary: '同步拉取微信公众号模板消息配置到本地' })
  async syncTemplate(@Query('accountId', ParseIntPipe) accountId: number) {
    await this.service.syncTemplate(accountId);
    return { data: true };
  }

  @Post('send')
  @RequirePermissions('mp:message-template:send')
  @Log({ module: '模板消息', type: 'CREATE', description: '发送模板消息' })
  @ApiOperation({ summary: '给粉丝推送微信模板消息' })
  async sendTemplateMessage(
    @Body() body: { id: number; openid: string; data: any; url?: string; miniprogram?: any }
  ) {
    const msgId = await this.service.sendTemplateMessage(
      body.id,
      body.openid,
      body.data,
      body.url,
      body.miniprogram
    );
    return { data: msgId };
  }
}
