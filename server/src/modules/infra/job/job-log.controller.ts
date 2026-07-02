import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { JobLogResponseDto } from '../dto/job-response.dto';

@ApiTags('基础设施 - 定时任务日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/job-log')
export class JobLogController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @RequirePermissions('infra:job:query')
  @ApiOperation({ summary: '查询定时任务运行日志列表' })
  @ApiOkResponse({ type: JobLogResponseDto, isArray: true })
  async findAll() {
    return this.jobService.findAllLogs();
  }
}

