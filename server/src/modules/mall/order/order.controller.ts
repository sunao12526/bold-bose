import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { Public } from '../../../shared/decorators/public.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { MallOrderStatus } from '@prisma/client';
import { OrderQueryDto } from './dto/order-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @RequirePermissions('mall:order:query')
  async findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('mall:order:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Put(':id/adjust-price')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '订单改价' })
  async adjustPrice(
    @Param('id', ParseIntPipe) id: number,
    @Body('discountPrice', ParseIntPipe) discountPrice: number,
    @Body('payPrice', ParseIntPipe) payPrice: number,
  ) {
    return this.orderService.adjustPrice(id, discountPrice, payPrice);
  }

  @Put(':id/pay-mock')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '订单模拟支付' })
  async payMock(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.payMock(id);
  }

  @Public()
  @Post('pay-notify')
  async payNotify(
    @Body('merchantOrderId') merchantOrderId: string,
    @Body('payOrderId') payOrderId: number,
    @Body('status') status: string,
    @Body('payTime') payTime: Date | string,
  ) {
    await this.orderService.payNotify(
      merchantOrderId,
      payOrderId,
      status,
      payTime,
    );
    return 'success';
  }

  @Put(':id/ship')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '订单发货' })
  async ship(
    @Param('id', ParseIntPipe) id: number,
    @Body('logisticsCo') logisticsCo: string,
    @Body('logisticsNo') logisticsNo: string,
  ) {
    return this.orderService.ship(id, logisticsCo, logisticsNo);
  }

  @Put(':id/cancel')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '取消订单' })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.cancel(id);
  }
}
