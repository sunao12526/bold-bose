import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SmsCodeService } from './sms-code.service';
import { Public } from '../../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { Throttle } from '@nestjs/throttler';

import { SmsCodeQueryDto } from '../dto/sms-code-query.dto';

@Controller('system/sms')
export class SmsCodeController {
  constructor(private readonly smsCodeService: SmsCodeService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('send-code')
  @Log({ module: '短信管理', type: 'OTHER', description: '发送短信验证码' })
  async sendCode(
    @Body('mobile') mobile: string,
    @Body('scene') scene: number,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.smsCodeService.sendCode(mobile, scene, ip);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('verify-code')
  @Log({ module: '短信管理', type: 'OTHER', description: '验证短信验证码' })
  async verifyCode(
    @Body('mobile') mobile: string,
    @Body('code') code: string,
    @Body('scene') scene: number,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.smsCodeService.verifyCode(mobile, code, scene, ip);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('code')
  @RequirePermissions('system:sms:query')
  async findAll(@Query() query: SmsCodeQueryDto) {
    return this.smsCodeService.findAllCodes(query);
  }
}
