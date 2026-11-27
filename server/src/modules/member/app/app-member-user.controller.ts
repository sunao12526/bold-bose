import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../shared/decorators/public.decorator';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AppMemberAuthService } from './app-member-auth.service';
import {
  AppMemberUpdateMobileDto,
  AppMemberUpdatePasswordDto,
  AppMemberUpdateProfileDto,
} from './dto/app-member.dto';
import { MemberAuthGuard } from './member-auth.guard';

@ApiTags('C端 - 会员信息')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/member/user')
export class AppMemberUserController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AppMemberAuthService,
  ) {}

  @Get('get')
  @ApiOperation({ summary: '获取当前会员基本信息' })
  async getInfo(@Req() req: any) {
    return this.prisma.memberUser.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        mobile: true,
        points: true,
        balance: true,
        experience: true,
        levelId: true,
        groupId: true,
        level: { select: { id: true, name: true, level: true, discountPercent: true } },
        group: { select: { id: true, name: true } },
      },
    });
  }

  @Put('update')
  @ApiOperation({ summary: '修改会员昵称与头像' })
  async update(@Req() req: any, @Body() body: AppMemberUpdateProfileDto) {
    return this.prisma.memberUser.update({
      where: { id: req.user.id },
      data: {
        nickname: body.nickname,
        avatar: body.avatar,
      },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        mobile: true,
      },
    });
  }

  @Put('update-mobile')
  @ApiOperation({ summary: '更换会员绑定手机号' })
  async updateMobile(@Req() req: any, @Body() body: AppMemberUpdateMobileDto) {
    const ip = req.ip || req.headers?.['x-forwarded-for'] || '127.0.0.1';
    return this.authService.updateMobile(req.user.id, body.mobile, body.code, ip);
  }

  @Put('update-password')
  @ApiOperation({ summary: '通过短信验证码设置或修改会员密码' })
  async updatePassword(@Req() req: any, @Body() body: AppMemberUpdatePasswordDto) {
    const ip = req.ip || req.headers?.['x-forwarded-for'] || '127.0.0.1';
    return this.authService.updatePassword(
      req.user.id,
      body.code,
      body.password,
      ip,
    );
  }
}
