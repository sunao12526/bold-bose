import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LogService } from './log.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Keep } from '../../../shared/decorators/keep.decorator';
import { ExcelService } from '../../../shared/excel/excel.service';
import { OperationLogResponseDto } from '../dto/log-response.dto';

@ApiTags('基础设施 - 操作日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/log')
export class LogController {
  constructor(
    private logService: LogService,
    private excelService: ExcelService,
  ) {}

  @Get()
  @RequirePermissions('infra:log:query')
  @ApiOperation({ summary: '查询所有系统操作日志列表' })
  @ApiOkResponse({ type: OperationLogResponseDto, isArray: true })
  async findAll() {
    return this.logService.findAll();
  }

  @Get('export-excel')
  @Keep()
  @RequirePermissions('infra:log:export')
  @ApiOperation({ summary: '导出操作日志 Excel' })
  async exportExcel(@Res() res: Response) {
    const rows = await this.logService.findAll();
    this.excelService.sendExcelResponse(
      res,
      '操作日志.xlsx',
      rows,
      [
        { header: '日志编号', key: 'id', width: 10 },
        { header: '操作人', key: 'username', width: 16 },
        { header: '模块', key: 'module', width: 16 },
        { header: '类型', key: 'type', width: 12 },
        { header: '描述', key: 'description', width: 28 },
        { header: '请求方法', key: 'method', width: 10 },
        { header: '请求路径', key: 'path', width: 32 },
        { header: '操作 IP', key: 'ip', width: 16 },
        { header: '归属地', key: 'location', width: 20 },
        { header: '状态码', key: 'status', width: 10 },
        { header: '耗时(ms)', key: 'duration', width: 10 },
        { header: '操作时间', key: 'createdAt', width: 22 },
      ],
      '操作日志',
    );
  }
}

