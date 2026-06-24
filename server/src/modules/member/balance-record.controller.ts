import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BalanceRecordService } from './balance-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/balance-record')
export class BalanceRecordController {
  constructor(private balanceRecordService: BalanceRecordService) {}

  @Get()
  @RequirePermissions('member:sign-in-record:query') // 复用已有的签到日志查询权限
  async findAll(@Query() query: any) {
    return this.balanceRecordService.findAll(query);
  }
}
