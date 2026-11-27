import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { AreaService } from './area.service';

@ApiTags('系统 - 行政区划')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('system/area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('tree')
  @ApiOperation({ summary: '获取行政区划树' })
  getTree() {
    return this.areaService.getTree();
  }

  @Get('get-by-ip')
  @ApiOperation({ summary: '根据 IP 查询归属地区' })
  async getByIp(@Query('ip') ip: string) {
    if (!ip || !ip.trim()) {
      throw new BadRequestException('ip 参数不能为空');
    }
    return this.areaService.getAreaByIp(ip.trim());
  }
}
