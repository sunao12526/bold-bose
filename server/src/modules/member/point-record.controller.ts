import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PointRecordService } from './point-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/point-record')
export class PointRecordController {
  constructor(private pointRecordService: PointRecordService) {}

  @Get()
  @RequirePermissions('member:sign-in-record:query') // 复用已有的签到日志查询权限
  async findAll(@Query() query: any) {
    return this.pointRecordService.findAll(query);
  }
}
