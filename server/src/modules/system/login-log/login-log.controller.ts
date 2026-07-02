import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginLogService } from './login-log.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

import { LoginLogQueryDto } from '../dto/login-log-query.dto';
import { LoginLogListResponseDto } from '../dto/login-log-response.dto';

@ApiTags('系统 - 登录日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/login-log')
export class LoginLogController {
  constructor(private readonly service: LoginLogService) {}

  @Get()
  @RequirePermissions('system:login-log:query')
  @ApiOperation({ summary: '分页查询用户登录日志列表' })
  @ApiOkResponse({ type: LoginLogListResponseDto })
  async findAll(@Query() query: LoginLogQueryDto) {
    return this.service.findAll(query);
  }
}

