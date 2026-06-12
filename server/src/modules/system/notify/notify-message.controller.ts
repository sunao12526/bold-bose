import { Controller, Get, Put, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('system/notify-message')
export class NotifyMessageController {
  constructor(private notifyService: NotifyService) {}

  @Get('my-inbox')
  async getMyInbox(@Req() req: any) {
    return this.notifyService.getMyInbox(req.user.id);
  }

  @Put('mark-read/:id')
  async markRead(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notifyService.markRead(req.user.id, id);
  }

  @Put('mark-all-read')
  async markAllRead(@Req() req: any) {
    return this.notifyService.markAllRead(req.user.id);
  }
}
