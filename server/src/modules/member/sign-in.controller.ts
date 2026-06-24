import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CommonStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member')
export class SignInController {
  constructor(private signInService: SignInService) {}

  @Get('sign-in-config')
  @RequirePermissions('member:sign-in-config:query')
  async findAllConfigs() {
    return this.signInService.findAllConfigs();
  }

  @Put('sign-in-config/:day')
  @RequirePermissions('member:sign-in-config:update')
  @Log({ module: '签到规则', type: 'UPDATE', description: '修改签到奖励配置' })
  async updateConfig(
    @Param('day', ParseIntPipe) day: number,
    @Body('point', ParseIntPipe) point: number,
    @Body('status') status: CommonStatus,
  ) {
    return this.signInService.updateConfig(day, point, status);
  }

  @Get('sign-in-record')
  @RequirePermissions('member:sign-in-record:query')
  async findAllRecords(@Query() query: any) {
    return this.signInService.findAllRecords(query);
  }

  @Post('user/:id/sign-in')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'CREATE', description: '模拟会员每日签到' })
  async signIn(@Param('id', ParseIntPipe) id: number) {
    return this.signInService.signIn(id);
  }
}
