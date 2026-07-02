import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { SaveConfigDto } from './dto/member-input.dto';
import { MemberConfigResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 全局设置')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  @RequirePermissions('member:config:query')
  @ApiOperation({ summary: '获取全局会员系统设置' })
  @ApiOkResponse({ type: MemberConfigResponseDto })
  async getConfig() {
    return this.configService.getConfig();
  }

  @Put()
  @RequirePermissions('member:config:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '修改全局会员设置' })
  @ApiOperation({ summary: '修改并保存全局会员系统设置' })
  @ApiOkResponse({ type: MemberConfigResponseDto })
  async saveConfig(@Body() data: SaveConfigDto) {
    return this.configService.saveConfig(data);
  }
}

