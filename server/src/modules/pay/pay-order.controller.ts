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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PayOrderService } from './pay-order.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { SubmitPayOrderDto } from './dto/pay-input.dto';
import { PayOrderResponseDto, PayOrderSubmitResultDto } from './dto/pay-response.dto';

@ApiTags('支付中心 - 支付订单')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/order')
export class PayOrderController {
  constructor(private orderService: PayOrderService) {}

  @Get()
  @RequirePermissions('pay:order:query')
  @ApiOperation({ summary: '获取全部支付订单列表' })
  @ApiOkResponse({ type: PayOrderResponseDto, isArray: true })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @RequirePermissions('pay:order:query')
  @ApiOperation({ summary: '根据 ID 获取支付订单详情' })
  @ApiOkResponse({ type: PayOrderResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Post(':id/submit')
  @RequirePermissions('pay:order:update')
  @Log({ module: '支付订单', type: 'UPDATE', description: '提交支付订单' })
  @ApiOperation({ summary: '提交并唤起支付订单' })
  @ApiOkResponse({ type: PayOrderSubmitResultDto })
  async submit(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SubmitPayOrderDto,
  ) {
    return this.orderService.submitPayOrder(id, body.channelCode);
  }

  @Put(':id/pay-mock')
  @RequirePermissions('pay:order:update')
  @Log({ module: '支付订单', type: 'UPDATE', description: '模拟支付成功' })
  @ApiOperation({ summary: '模拟沙箱支付订单成功' })
  @ApiOkResponse({ type: PayOrderResponseDto })
  async payMock(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.payMock(id);
  }
}

