import { Controller, Get, Query, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@ApiTags('微信公众号 - 数据统计')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/statistics')
export class MpStatisticsController {
  constructor(private prisma: PrismaService) {}

  @Get('user-summary')
  @RequirePermissions('mp:statistics:query')
  @ApiOperation({ summary: '获取粉丝增减统计数据' })
  async getUserSummary(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('days', ParseIntPipe) days = 7
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    // 统计最近 N 天的用户关注与取关变动情况 (从本地 mpUser 计算)
    const summaryList: any[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const newSubscribe = await this.prisma.mpUser.count({
        where: {
          accountId,
          subscribeStatus: 1,
          subscribeTime: { gte: startOfDay, lte: endOfDay },
        },
      });

      const unsubscribe = await this.prisma.mpUser.count({
        where: {
          accountId,
          unsubscribeTime: { gte: startOfDay, lte: endOfDay },
        },
      });

      summaryList.push({
        refDate: startOfDay.toISOString().slice(0, 10),
        newUser: newSubscribe,
        cancelUser: unsubscribe,
        netGrowUser: newSubscribe - unsubscribe,
      });
    }

    return { data: summaryList };
  }

  @Get('message-summary')
  @RequirePermissions('mp:statistics:query')
  @ApiOperation({ summary: '获取消息发送统计数据' })
  async getMessageSummary(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('days', ParseIntPipe) days = 7
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    const summaryList: any[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      // 粉丝上行消息总数
      const userMsgCount = await this.prisma.mpMessage.count({
        where: {
          accountId,
          sendFrom: 1, // 粉丝发给系统
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      // 系统下发消息总数
      const sysMsgCount = await this.prisma.mpMessage.count({
        where: {
          accountId,
          sendFrom: 2, // 系统回复
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      summaryList.push({
        refDate: startOfDay.toISOString().slice(0, 10),
        userMsgCount,
        sysMsgCount,
      });
    }

    return { data: summaryList };
  }
}
