import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExperienceRecordService } from './experience-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/experience-record')
export class ExperienceRecordController {
  constructor(private experienceRecordService: ExperienceRecordService) {}

  @Get()
  @RequirePermissions('member:user:query')
  async findAll(@Query() query: any) {
    return this.experienceRecordService.findAll(query);
  }
}
