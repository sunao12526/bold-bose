import {
  Controller,
  Get,
  Put,
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
import { PayRefundService } from './pay-refund.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { PayRefundResponseDto } from './dto/pay-response.dto';

@ApiTags('支付中心 - 退款订单')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/refund')
export class PayRefundController {
  constructor(private refundService: PayRefundService) {}

  @Get()
  @RequirePermissions('pay:refund:query')
  @ApiOperation({ summary: '获取全部退款订单列表' })
  @ApiOkResponse({ type: PayRefundResponseDto, isArray: true })
  async findAll() {
    return this.refundService.findAll();
  }

  @Get(':id')
  @RequirePermissions('pay:refund:query')
  @ApiOperation({ summary: '根据 ID 获取退款订单详情' })
  @ApiOkResponse({ type: PayRefundResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.findOne(id);
  }

  @Put(':id/refund-mock')
  @RequirePermissions('pay:refund:update')
  @Log({ module: '退款订单', type: 'UPDATE', description: '模拟退款成功' })
  @ApiOperation({ summary: '模拟沙箱退款订单成功' })
  @ApiOkResponse({ type: PayRefundResponseDto })
  async refundMock(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.refundMock(id);
  }
}

