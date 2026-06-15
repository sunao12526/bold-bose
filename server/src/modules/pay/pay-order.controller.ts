import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PayOrderService } from './pay-order.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/order')
export class PayOrderController {
  constructor(private orderService: PayOrderService) {}

  @Get()
  @RequirePermissions('pay:order:query')
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @RequirePermissions('pay:order:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Post(':id/submit')
  @RequirePermissions('pay:order:update')
  @Log({ module: '支付订单', type: 'UPDATE', description: '提交支付订单' })
  async submit(
    @Param('id', ParseIntPipe) id: number,
    @Body('channelCode') channelCode: string,
  ) {
    return this.orderService.submitPayOrder(id, channelCode);
  }

  @Put(':id/pay-mock')
  @RequirePermissions('pay:order:update')
  @Log({ module: '支付订单', type: 'UPDATE', description: '模拟支付成功' })
  async payMock(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.payMock(id);
  }
}
