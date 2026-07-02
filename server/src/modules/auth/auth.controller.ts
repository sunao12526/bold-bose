import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Query,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CaptchaService } from './captcha.service';
import { Throttle } from '@nestjs/throttler';
import {
  CaptchaResponseDto,
  LoginResponseDto,
  PermissionInfoResponseDto,
  SocialLoginUrlResponseDto,
  SuccessResponseDto,
  SocialBindStatusDto,
} from './dto/auth-response.dto';
import {
  SocialLoginUrlQueryDto,
  SocialLoginDto,
  SocialBindDto,
  SocialUnbindDto,
} from './dto/social.dto';

@ApiTags('系统 - 认证授权')
@Controller('system/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @Public()
  @Get('captcha')
  @ApiOperation({ summary: '获取验证码图片' })
  @ApiOkResponse({ type: CaptchaResponseDto })
  getCaptcha() {
    return this.captchaService.generate();
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: '使用账号密码登录' })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    this.logger.log(
      `[Login] Received body: username=${loginDto.username}, captchaKey=${loginDto.captchaKey}`,
    );
    if (!loginDto.captchaKey || !loginDto.captchaCode) {
      throw new UnauthorizedException('请输入验证码');
    }
    const valid = this.captchaService.verify(
      loginDto.captchaKey,
      loginDto.captchaCode,
    );
    this.logger.log(`[Login] Captcha verify result: ${valid}`);
    if (!valid) {
      throw new UnauthorizedException('验证码错误');
    }
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.login(loginDto, ip, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '退出登录' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-permission-info')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前登录用户的角色与权限信息' })
  @ApiOkResponse({ type: PermissionInfoResponseDto })
  async getPermissionInfo(@Req() req: any) {
    return this.authService.getUserPermissionInfo(req.user.id);
  }

  @Public()
  @Get('social-login-url')
  @ApiOperation({ summary: '获取社交平台 OAuth 授权重定向链接' })
  @ApiOkResponse({ type: SocialLoginUrlResponseDto })
  async getSocialLoginUrl(
    @Query() query: SocialLoginUrlQueryDto,
  ) {
    return this.authService.getSocialLoginUrl(query.type, query.redirectUri);
  }

  @Public()
  @Post('social-login')
  @ApiOperation({ summary: '社交快捷登录' })
  @ApiOkResponse({ type: LoginResponseDto })
  async socialLogin(
    @Body() body: SocialLoginDto,
    @Req() req: any,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    return this.authService.socialLogin(body.type, body.code, body.redirectUri, ip, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('social-bind')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '绑定社交平台账号' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async socialBind(
    @Req() req: any,
    @Body() body: SocialBindDto,
  ) {
    return this.authService.socialBind(req.user.id, body.type, body.code, body.redirectUri);
  }

  @UseGuards(JwtAuthGuard)
  @Post('social-unbind')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '解绑社交平台账号' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async socialUnbind(@Req() req: any, @Body() body: SocialUnbindDto) {
    return this.authService.socialUnbind(req.user.id, body.type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-bind-status')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前用户社交账号绑定状态列表' })
  @ApiOkResponse({ type: SocialBindStatusDto, isArray: true })
  async getSocialBindStatus(@Req() req: any) {
    return this.authService.getSocialBindStatus(req.user.id);
  }
}

