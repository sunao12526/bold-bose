import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

import { LoginLogQueryDto } from '../dto/login-log-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/login-log')
export class LoginLogController {
  constructor(private readonly service: LoginLogService) {}

  @Get()
  @RequirePermissions('system:login-log:query')
  async findAll(@Query() query: LoginLogQueryDto) {
    return this.service.findAll(query);
  }
}
