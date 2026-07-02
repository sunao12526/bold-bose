import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { OperationLogResponseDto } from '../dto/log-response.dto';

@ApiTags('基础设施 - 操作日志')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/log')
export class LogController {
  constructor(private logService: LogService) {}

  @Get()
  @RequirePermissions('infra:log:query')
  @ApiOperation({ summary: '查询所有系统操作日志列表' })
  @ApiOkResponse({ type: OperationLogResponseDto, isArray: true })
  async findAll() {
    return this.logService.findAll();
  }
}

