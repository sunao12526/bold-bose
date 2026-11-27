import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
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
import { Keep } from '../../../shared/decorators/keep.decorator';
import { ExcelService } from '../../../shared/excel/excel.service';

import { LoginLogQueryDto } from '../dto/login-log-query.dto';
import { LoginLogListResponseDto } from '../dto/login-log-response.dto';

@ApiTags('系统 - 登录日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/login-log')
export class LoginLogController {
  constructor(
    private readonly service: LoginLogService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  @RequirePermissions('system:login-log:query')
  @ApiOperation({ summary: '分页查询用户登录日志列表' })
  @ApiOkResponse({ type: LoginLogListResponseDto })
  async findAll(@Query() query: LoginLogQueryDto) {
    return this.service.findAll(query);
  }

  @Get('export-excel')
  @Keep()
  @RequirePermissions('system:login-log:export')
  @ApiOperation({ summary: '导出登录日志 Excel' })
  async exportExcel(@Query() query: LoginLogQueryDto, @Res() res: Response) {
    const rows = await this.service.findAll(query);
    this.excelService.sendExcelResponse(
      res,
      '登录日志.xlsx',
      rows,
      [
        { header: '日志编号', key: 'id', width: 10 },
        { header: '用户名', key: 'username', width: 18 },
        { header: '登录 IP', key: 'ip', width: 18 },
        { header: '归属地', key: 'location', width: 22 },
        { header: '状态', key: 'status', width: 12 },
        { header: '结果消息', key: 'message', width: 26 },
        { header: '登录时间', key: 'loginTime', width: 22 },
      ],
      '登录日志',
    );
  }
}

