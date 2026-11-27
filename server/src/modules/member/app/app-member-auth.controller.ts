import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../../shared/decorators/public.decorator';
import {
  AppMemberLoginDto,
  AppMemberRefreshTokenDto,
  AppMemberSendSmsCodeDto,
  AppMemberSmsLoginDto,
} from './dto/app-member.dto';
import { AppMemberAuthService } from './app-member-auth.service';
import { MemberAuthGuard } from './member-auth.guard';

@ApiTags('C端 - 会员认证')
@Public()
@Controller('app-api/member/auth')
export class AppMemberAuthController {
  constructor(private readonly authService: AppMemberAuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: '会员手机号密码登录' })
  async login(@Body() body: AppMemberLoginDto, @Req() req: any) {
    const ip = req.ip || req.headers?.['x-forwarded-for'] || '127.0.0.1';
    return this.authService.login(body.mobile, body.password, ip);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('send-sms-code')
  @ApiOperation({ summary: '发送会员短信验证码' })
  async sendSmsCode(@Body() body: AppMemberSendSmsCodeDto, @Req() req: any) {
    const ip = req.ip || req.headers?.['x-forwarded-for'] || '127.0.0.1';
    return this.authService.sendSmsCode(body.mobile, body.scene ?? 1, ip);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('sms-login')
  @ApiOperation({ summary: '会员短信验证码登录（未注册自动创建）' })
  async smsLogin(@Body() body: AppMemberSmsLoginDto, @Req() req: any) {
    const ip = req.ip || req.headers?.['x-forwarded-for'] || '127.0.0.1';
    return this.authService.smsLogin(body.mobile, body.code, ip);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: '刷新会员登录令牌' })
  async refreshToken(@Body() body: AppMemberRefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(MemberAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @ApiOperation({ summary: '会员退出登录' })
  async logout(@Req() req: any) {
    const token = req.headers?.authorization?.replace('Bearer ', '') || '';
    return this.authService.logout(token);
  }
}
