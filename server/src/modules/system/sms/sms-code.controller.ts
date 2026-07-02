import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SmsCodeService } from './sms-code.service';
import { Public } from '../../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { Throttle } from '@nestjs/throttler';

import { SmsCodeQueryDto } from '../dto/sms-code-query.dto';
import { SendSmsCodeDto, VerifySmsCodeDto } from '../dto/sms-input.dto';
import { SmsCodeListResponseDto, SendSmsCodeResponseDto } from '../dto/sms-response.dto';
import { SuccessResponseDto } from '../../../shared/dto/success-response.dto';

@ApiTags('系统 - 短信验证码')
@Controller('system/sms')
export class SmsCodeController {
  constructor(private readonly smsCodeService: SmsCodeService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('send-code')
  @Log({ module: '短信管理', type: 'OTHER', description: '发送短信验证码' })
  @ApiOperation({ summary: '发送短信验证码' })
  @ApiOkResponse({ type: SendSmsCodeResponseDto })
  async sendCode(
    @Body() body: SendSmsCodeDto,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.smsCodeService.sendCode(body.mobile, body.scene, ip);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('verify-code')
  @Log({ module: '短信管理', type: 'OTHER', description: '验证短信验证码' })
  @ApiOperation({ summary: '校验短信验证码' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async verifyCode(
    @Body() body: VerifySmsCodeDto,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    return this.smsCodeService.verifyCode(body.mobile, body.code, body.scene, ip);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get('code')
  @RequirePermissions('system:sms:query')
  @ApiOperation({ summary: '分页查询短信验证码发送记录' })
  @ApiOkResponse({ type: SmsCodeListResponseDto })
  async findAll(@Query() query: SmsCodeQueryDto) {
    return this.smsCodeService.findAllCodes(query);
  }
}

