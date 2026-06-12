import { Controller, Get, Put, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PayRefundService } from './pay-refund.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/refund')
export class PayRefundController {
  constructor(private refundService: PayRefundService) {}

  @Get()
  @RequirePermissions('pay:refund:query')
  async findAll() {
    return this.refundService.findAll();
  }

  @Get(':id')
  @RequirePermissions('pay:refund:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.findOne(id);
  }

  @Put(':id/refund-mock')
  @RequirePermissions('pay:refund:update')
  @Log({ module: '退款订单', type: 'UPDATE', description: '模拟退款成功' })
  async refundMock(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.refundMock(id);
  }
}
