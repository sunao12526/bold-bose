import { Controller, Get, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/job-log')
export class JobLogController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  @RequirePermissions('infra:job:query')
  async findAll() {
    return this.jobService.findAllLogs();
  }
}
