import { Controller, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpMessageService } from './mp-message.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { MessageQueryDto } from '../dto/message-query.dto';
import { MpMessageResponseDto, MpMessageListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 消息历史')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/message')
export class MpMessageController {
  constructor(private service: MpMessageService) {}

  @Get()
  @RequirePermissions('mp:message:query')
  @ApiOperation({ summary: '分页查询消息历史列表' })
  @ApiOkResponse({ type: MpMessageListResponseDto })
  async findAll(@Query() query: MessageQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:message:query')
  @ApiOperation({ summary: '根据 ID 获取消息详情' })
  @ApiOkResponse({ type: MpMessageResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post('send')
  @RequirePermissions('mp:message:send')
  @ApiOperation({ summary: '给粉丝发送客服消息' })
  async sendMessage(
    @Body() body: { accountId: number; openid: string; type: string; content: string; mediaId?: string }
  ) {
    const record = await this.service.sendKefuMessage(body);
    return { data: record };
  }
}

