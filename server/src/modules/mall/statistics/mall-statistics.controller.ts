import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { MallStatisticsService } from './mall-statistics.service';

@ApiTags('商城中心 - 数据统计')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/statistics')
export class MallStatisticsController {
  constructor(private readonly statisticsService: MallStatisticsService) {}

  @Get('trade-summary')
  @RequirePermissions('mall:statistics:query')
  @ApiOperation({ summary: '获取交易统计汇总' })
  async getTradeSummary() {
    return this.statisticsService.getTradeSummary();
  }

  @Get('member-summary')
  @RequirePermissions('mall:statistics:query')
  @ApiOperation({ summary: '获取会员统计汇总' })
  async getMemberSummary() {
    return this.statisticsService.getMemberSummary();
  }

  @Get('product-summary')
  @RequirePermissions('mall:statistics:query')
  @ApiOperation({ summary: '获取商品统计汇总与热销排行' })
  async getProductSummary() {
    return this.statisticsService.getProductSummary();
  }
}
