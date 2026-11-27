import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { RedisService } from '../../../shared/redis/redis.service';

@ApiTags('基础设施 - Redis 监控')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/redis')
export class RedisMonitorController {
  constructor(private readonly redisService: RedisService) {}

  @Get('get-monitor-info')
  @RequirePermissions('infra:redis:query')
  @ApiOperation({ summary: '获取 Redis 监控信息' })
  async getMonitorInfo() {
    return this.redisService.getInfo();
  }
}
