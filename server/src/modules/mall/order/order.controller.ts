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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { Public } from '../../../shared/decorators/public.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { OrderQueryDto } from './dto/order-query.dto';
import { AdjustOrderPriceDto, ShipOrderDto, OrderPayNotifyDto } from '../dto/mall-input.dto';
import { MallOrderResponseDto, MallOrderListResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 订单管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @RequirePermissions('mall:order:query')
  @ApiOperation({ summary: '分页查询商城订单列表' })
  @ApiOkResponse({ type: MallOrderListResponseDto })
  async findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('mall:order:query')
  @ApiOperation({ summary: '根据 ID 获取商城订单详情' })
  @ApiOkResponse({ type: MallOrderResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Put(':id/adjust-price')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '订单改价' })
  @ApiOperation({ summary: '修改待付款订单金额' })
  @ApiOkResponse({ type: MallOrderResponseDto })
  async adjustPrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AdjustOrderPriceDto,
  ) {
    return this.orderService.adjustPrice(id, data.discountPrice, data.payPrice);
  }

  @Put(':id/pay-mock')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '订单模拟支付' })
  @ApiOperation({ summary: '模拟沙箱支付商城订单' })
  @ApiOkResponse({ type: MallOrderResponseDto })
  async payMock(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.payMock(id);
  }

  @Public()
  @Post('pay-notify')
  @ApiOperation({ summary: '内部支付结果异步回调通知' })
  @ApiOkResponse({ type: String })
  async payNotify(
    @Body() data: OrderPayNotifyDto,
  ) {
    await this.orderService.payNotify(
      data.merchantOrderId,
      data.payOrderId,
      data.status,
      data.payTime,
    );
    return 'success';
  }

  @Put(':id/ship')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '订单发货' })
  @ApiOperation({ summary: '待发货订单发货并录入物流单号' })
  @ApiOkResponse({ type: MallOrderResponseDto })
  async ship(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ShipOrderDto,
  ) {
    return this.orderService.ship(id, data.logisticsCo, data.logisticsNo);
  }

  @Put(':id/cancel')
  @RequirePermissions('mall:order:update')
  @Log({ module: '订单管理', type: 'UPDATE', description: '取消订单' })
  @ApiOperation({ summary: '取消商城订单' })
  @ApiOkResponse({ type: MallOrderResponseDto })
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.cancel(id);
  }
}

