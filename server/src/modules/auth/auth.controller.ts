import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CaptchaService } from './captcha.service';

@Controller('system/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @Public()
  @Get('captcha')
  getCaptcha() {
    return this.captchaService.generate();
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    console.log('[Login] Received body:', {
      username: loginDto.username,
      captchaKey: loginDto.captchaKey,
      captchaCode: loginDto.captchaCode,
    });
    if (!loginDto.captchaKey || !loginDto.captchaCode) {
      throw new UnauthorizedException('请输入验证码');
    }
    const valid = this.captchaService.verify(
      loginDto.captchaKey,
      loginDto.captchaCode,
    );
    console.log('[Login] Captcha verify result:', valid);
    if (!valid) {
      throw new UnauthorizedException('验证码错误');
    }
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.login(loginDto, ip, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-permission-info')
  async getPermissionInfo(@Req() req: any) {
    return this.authService.getUserPermissionInfo(req.user.id);
  }

  @Public()
  @Get('social-login-url')
  async getSocialLoginUrl(
    @Query('type') type: string,
    @Query('redirectUri') redirectUri?: string,
  ) {
    return this.authService.getSocialLoginUrl(type, redirectUri);
  }

  @Public()
  @Post('social-login')
  async socialLogin(
    @Body('type') type: string,
    @Body('code') code: string,
    @Body('redirectUri') redirectUri: string,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.socialLogin(type, code, redirectUri, ip, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('social-bind')
  async socialBind(
    @Req() req: any,
    @Body('type') type: string,
    @Body('code') code: string,
    @Body('redirectUri') redirectUri?: string,
  ) {
    return this.authService.socialBind(req.user.id, type, code, redirectUri);
  }

  @UseGuards(JwtAuthGuard)
  @Post('social-unbind')
  async socialUnbind(@Req() req: any, @Body('type') type: string) {
    return this.authService.socialUnbind(req.user.id, type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-bind-status')
  async getSocialBindStatus(@Req() req: any) {
    return this.authService.getSocialBindStatus(req.user.id);
  }
}
