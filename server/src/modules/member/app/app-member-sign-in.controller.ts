import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import { Public } from '../../../shared/decorators/public.decorator';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';
import { SignInService } from '../sign-in.service';
import { MemberAuthGuard } from './member-auth.guard';

@ApiTags('C端 - 会员签到')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/member/sign-in')
export class AppMemberSignInController {
  constructor(
    private readonly signInService: SignInService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('config/list')
  @ApiOperation({ summary: '获取签到规则配置列表' })
  async getConfigList() {
    return this.prisma.memberSignInConfig.findMany({
      where: { status: CommonStatus.ENABLE },
      orderBy: { day: 'asc' },
    });
  }

  @Get('record/get-summary')
  @ApiOperation({ summary: '获取我的签到统计摘要' })
  async getSummary(@Req() req: any) {
    const memberId = req.user.id;
    const totalDay = await this.prisma.memberSignInRecord.count({
      where: { memberId },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayRecord = await this.prisma.memberSignInRecord.findFirst({
      where: { memberId, createdAt: { gte: todayStart, lte: todayEnd } },
    });

    const latestRecord = await this.prisma.memberSignInRecord.findFirst({
      where: { memberId },
      orderBy: { id: 'desc' },
    });

    return {
      totalDay,
      continuousDay: latestRecord?.day ?? 0,
      todaySignIn: !!todayRecord,
    };
  }

  @Post('record/create')
  @ApiOperation({ summary: '会员每日签到' })
  async create(@Req() req: any) {
    return this.signInService.signIn(req.user.id);
  }

  @Get('record/page')
  @ApiOperation({ summary: '分页查询我的签到记录' })
  async page(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return paginateQuery(
      this.prisma,
      'memberSignInRecord',
      { page, pageSize },
      {
        where: { memberId: req.user.id },
        orderBy: { id: 'desc' },
      },
    );
  }
}
