import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/log')
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  @RequirePermissions('infra:log:query')
  async findAll() {
    return this.logService.findAll();
  }
}
