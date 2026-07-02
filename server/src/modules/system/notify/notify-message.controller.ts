import {
  Controller,
  Get,
  Put,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotifyService } from './notify.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { NotifyMessageResponseDto } from '../dto/notify-response.dto';
import { SuccessResponseDto } from '../../../shared/dto/success-response.dto';

@ApiTags('系统 - 站内信消息')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('system/notify-message')
export class NotifyMessageController {
  constructor(private notifyService: NotifyService) {}

  @Get('my-inbox')
  @ApiOperation({ summary: '获取当前登录用户的站内信收件箱列表' })
  @ApiOkResponse({ type: NotifyMessageResponseDto, isArray: true })
  async getMyInbox(@Req() req: any) {
    return this.notifyService.getMyInbox(req.user.id);
  }

  @Put('mark-read/:id')
  @ApiOperation({ summary: '标记单条站内信为已读' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async markRead(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.notifyService.markRead(req.user.id, id);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: '标记所有站内信为已读' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async markAllRead(@Req() req: any) {
    return this.notifyService.markAllRead(req.user.id);
  }
}

