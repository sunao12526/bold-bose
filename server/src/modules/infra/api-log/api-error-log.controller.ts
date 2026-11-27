import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Keep } from '../../../shared/decorators/keep.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { ExcelService } from '../../../shared/excel/excel.service';
import { ApiErrorLogService } from './api-error-log.service';

export const ProcessErrorLogSchema = z.object({
  processStatus: z.coerce
    .number()
    .int()
    .refine((v) => v === 1 || v === 2, {
      message: '处理状态必须为 1(已处理) 或 2(已忽略)',
    }),
});
export class ProcessErrorLogDto extends createZodDto(ProcessErrorLogSchema) {}

@ApiTags('基础设施 - API 异常日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/api-error-log')
export class ApiErrorLogController {
  constructor(
    private readonly service: ApiErrorLogService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  @RequirePermissions('infra:api-error-log:query')
  @ApiOperation({ summary: '分页查询 API 异常日志' })
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('userId') userId?: string,
    @Query('requestUrl') requestUrl?: string,
    @Query('exceptionName') exceptionName?: string,
    @Query('processStatus') processStatus?: string,
  ) {
    return this.service.findAll({
      page,
      pageSize,
      userId,
      requestUrl,
      exceptionName,
      processStatus,
    });
  }

  @Get('export-excel')
  @Keep()
  @RequirePermissions('infra:api-error-log:export')
  @ApiOperation({ summary: '导出 API 异常日志 Excel' })
  async exportExcel(
    @Res() res: Response,
    @Query('userId') userId?: string,
    @Query('requestUrl') requestUrl?: string,
    @Query('exceptionName') exceptionName?: string,
    @Query('processStatus') processStatus?: string,
  ) {
    const rows = await this.service.findAllForExport({
      userId,
      requestUrl,
      exceptionName,
      processStatus,
    });

    const statusLabel: Record<number, string> = {
      0: '未处理',
      1: '已处理',
      2: '已忽略',
    };

    this.excelService.sendExcelResponse(
      res,
      'API异常日志.xlsx',
      rows,
      [
        { header: '日志编号', key: 'id', width: 10 },
        { header: '用户编号', key: 'userId', width: 12 },
        { header: '请求方法', key: 'requestMethod', width: 12 },
        { header: '请求地址', key: 'requestUrl', width: 36 },
        { header: '异常类名', key: 'exceptionName', width: 24 },
        { header: '异常消息', key: 'exceptionMessage', width: 40 },
        {
          header: '处理状态',
          key: 'processStatus',
          width: 12,
          formatter: (r) => statusLabel[r.processStatus] ?? String(r.processStatus),
        },
        { header: '异常时间', key: 'exceptionTime', width: 22 },
      ],
      'API异常日志',
    );
  }

  @Put(':id/process')
  @RequirePermissions('infra:api-error-log:update-status')
  @Log({ module: '异常日志', type: 'UPDATE', description: '更新异常日志处理状态' })
  @ApiOperation({ summary: '更新异常日志处理状态' })
  async updateProcess(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ProcessErrorLogDto,
    @Req() req: any,
  ) {
    return this.service.updateProcess(id, body.processStatus, req.user?.id);
  }
}
