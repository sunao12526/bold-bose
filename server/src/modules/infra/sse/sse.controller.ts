import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Keep } from '../../../shared/decorators/keep.decorator';
import { SseService } from '../../../shared/sse/sse.service';

export const SendSseMessageSchema = z.object({
  userId: z.coerce.number().int().optional(),
  type: z.string().min(1).max(50).default('notice'),
  data: z.unknown(),
});
export class SendSseMessageDto extends createZodDto(SendSseMessageSchema) {}

@ApiTags('基础设施 - SSE 实时推送')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('connect')
  @Keep()
  @ApiOperation({ summary: '建立后台管理端 SSE 长连接' })
  connect(@Req() req: any): Observable<MessageEvent> {
    return this.sseService.connect(req.user.id, 2);
  }

  @Get('online-stats')
  @RequirePermissions('infra:sse:query')
  @ApiOperation({ summary: '获取当前 SSE 在线连接统计' })
  getOnlineStats() {
    return this.sseService.getOnlineStats();
  }

  @Post('send')
  @RequirePermissions('infra:sse:send')
  @ApiOperation({ summary: '向指定用户或全体在线用户推送 SSE 消息' })
  send(@Body() body: SendSseMessageDto) {
    const delivered = body.userId
      ? this.sseService.sendToUser(body.userId, body.type, body.data, 2)
      : this.sseService.broadcast(body.type, body.data, 2);
    return { delivered };
  }
}
