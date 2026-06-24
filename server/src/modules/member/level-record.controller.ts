import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LevelRecordService } from './level-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/level-record')
export class LevelRecordController {
  constructor(private levelRecordService: LevelRecordService) {}

  @Get()
  @RequirePermissions('member:user:query')
  async findAll(@Query() query: any) {
    return this.levelRecordService.findAll(query);
  }
}
