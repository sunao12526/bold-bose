import { Controller, Get, Put, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RefundService } from './refund.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/refund')
export class RefundController {
  constructor(private refundService: RefundService) {}

  @Get()
  @RequirePermissions('mall:refund:query')
  async findAll() {
    return this.refundService.findAll();
  }

  @Get(':id')
  @RequirePermissions('mall:refund:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.findOne(id);
  }

  @Put(':id/approve')
  @RequirePermissions('mall:refund:update')
  @Log({ module: '退款售后', type: 'UPDATE', description: '同意退款申请' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body('auditRemark') auditRemark?: string,
  ) {
    return this.refundService.approve(id, auditRemark);
  }

  @Put(':id/reject')
  @RequirePermissions('mall:refund:update')
  @Log({ module: '退款售后', type: 'UPDATE', description: '拒绝退款申请' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body('auditRemark') auditRemark: string,
  ) {
    return this.refundService.reject(id, auditRemark);
  }
}
