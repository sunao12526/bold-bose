import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Keep } from '../../../shared/decorators/keep.decorator';
import { ExcelService } from '../../../shared/excel/excel.service';
import { ApiAccessLogService } from './api-access-log.service';

@ApiTags('基础设施 - API 访问日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/api-access-log')
export class ApiAccessLogController {
  constructor(
    private readonly service: ApiAccessLogService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  @RequirePermissions('infra:api-access-log:query')
  @ApiOperation({ summary: '分页查询 API 访问日志' })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('userId') userId?: string,
    @Query('userType') userType?: string,
    @Query('requestMethod') requestMethod?: string,
    @Query('requestUrl') requestUrl?: string,
    @Query('resultCode') resultCode?: string,
  ) {
    return this.service.findAll({
      page,
      pageSize,
      userId,
      userType,
      requestMethod,
      requestUrl,
      resultCode,
    });
  }

  @Get('export-excel')
  @Keep()
  @RequirePermissions('infra:api-access-log:export')
  @ApiOperation({ summary: '导出 API 访问日志 Excel' })
  async exportExcel(
    @Res() res: Response,
    @Query('userId') userId?: string,
    @Query('userType') userType?: string,
    @Query('requestMethod') requestMethod?: string,
    @Query('requestUrl') requestUrl?: string,
    @Query('resultCode') resultCode?: string,
  ) {
    const rows = await this.service.findAllForExport({
      userId,
      userType,
      requestMethod,
      requestUrl,
      resultCode,
    });

    this.excelService.sendExcelResponse(
      res,
      'API访问日志.xlsx',
      rows,
      [
        { header: '日志编号', key: 'id', width: 10 },
        { header: '用户编号', key: 'userId', width: 12 },
        { header: '用户类型', key: 'userType', width: 12 },
        { header: '请求方法', key: 'requestMethod', width: 12 },
        { header: '请求地址', key: 'requestUrl', width: 40 },
        { header: '用户 IP', key: 'userIp', width: 18 },
        { header: '耗时(ms)', key: 'duration', width: 12 },
        { header: '结果码', key: 'resultCode', width: 10 },
        { header: '开始时间', key: 'beginTime', width: 22 },
      ],
      'API访问日志',
    );
  }
}
