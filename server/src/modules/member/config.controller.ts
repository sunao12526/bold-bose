import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  @RequirePermissions('member:config:query')
  async getConfig() {
    return this.configService.getConfig();
  }

  @Put()
  @RequirePermissions('member:config:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '修改全局会员设置' })
  async saveConfig(@Body() data: any) {
    return this.configService.saveConfig(data);
  }
}
