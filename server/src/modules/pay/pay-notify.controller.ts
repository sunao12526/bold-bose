import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { Keep } from '../../shared/decorators/keep.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { paginateQuery } from '../../shared/pagination';
import { NotifyService } from './notify.service';
import { PayOrderService } from './pay-order.service';
import { PayRefundService } from './pay-refund.service';
import { PayWalletService } from './wallet/pay-wallet.service';

@ApiTags('支付中心 - 支付回调与通知任务')
@Controller('pay/notify')
export class PayNotifyController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payOrderService: PayOrderService,
    private readonly payRefundService: PayRefundService,
    private readonly notifyService: NotifyService,
    private readonly walletService: PayWalletService,
  ) {}

  @Public()
  @Keep()
  @Post('order/:channelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '接收第三方支付渠道支付结果异步回调' })
  async orderNotify(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Headers() headers: Record<string, any>,
    @Body() body: any,
  ) {
    await this.payOrderService.handleChannelNotify(channelId, headers, body);
    return { code: 'SUCCESS', message: '成功' };
  }

  @Public()
  @Keep()
  @Post('refund/:channelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '接收第三方支付渠道退款结果异步回调' })
  async refundNotify(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Headers() headers: Record<string, any>,
    @Body() body: any,
  ) {
    await this.payRefundService.handleChannelRefundNotify(
      channelId,
      headers,
      body,
    );
    return { code: 'SUCCESS', message: '成功' };
  }

  @Public()
  @Keep()
  @Post('wallet-recharge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '钱包充值支付成功内部回调' })
  async walletRechargeNotify(@Body() body: any) {
    const merchantOrderId = String(body?.merchantOrderId || '');
    const payOrderId = Number(body?.payOrderId);
    const status = String(body?.status || '');
    if (status === 'SUCCESS' && merchantOrderId.startsWith('RECHARGE_')) {
      const rechargeId = Number(merchantOrderId.replace('RECHARGE_', ''));
      if (Number.isInteger(rechargeId) && rechargeId > 0) {
        const payOrder = Number.isInteger(payOrderId)
          ? await this.prisma.payOrder.findUnique({ where: { id: payOrderId } })
          : null;
        await this.walletService.updateRechargePaid(
          rechargeId,
          payOrderId,
          payOrder?.channelCode ?? undefined,
        );
      }
    }
    return 'success';
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('page')
  @RequirePermissions('pay:notify:query')
  @ApiOperation({ summary: '分页查询支付通知任务日志' })
  async getNotifyPage(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('appId') appId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    const where: any = {};
    if (appId) where.appId = Number(appId);
    if (status) where.status = status;
    if (type) where.type = type;

    return paginateQuery(this.prisma, 'payNotifyLog', { page, pageSize }, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post(':id/retry')
  @RequirePermissions('pay:notify:update')
  @ApiOperation({ summary: '手动重发支付通知' })
  async retryNotify(@Param('id', ParseIntPipe) id: number) {
    await this.notifyService.sendNotification(id);
    return { success: true };
  }
}
