import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import { Public } from '../../../shared/decorators/public.decorator';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';
import { MemberAuthGuard } from './member-auth.guard';

@ApiTags('C端 - 会员等级与资产流水')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/member')
export class AppMemberAssetsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('level/list')
  @ApiOperation({ summary: '获取启用的会员等级列表' })
  async getLevelList() {
    return this.prisma.memberLevel.findMany({
      where: { status: CommonStatus.ENABLE },
      orderBy: { level: 'asc' },
    });
  }

  @Get('point/record/page')
  @ApiOperation({ summary: '分页查询我的积分记录' })
  async getPointRecordPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return paginateQuery(
      this.prisma,
      'memberPointRecord',
      { page, pageSize },
      {
        where: { memberId: req.user.id },
        orderBy: { id: 'desc' },
      },
    );
  }

  @Get('experience-record/page')
  @ApiOperation({ summary: '分页查询我的成长值记录' })
  async getExperienceRecordPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return paginateQuery(
      this.prisma,
      'memberExperienceRecord',
      { page, pageSize },
      {
        where: { memberId: req.user.id },
        orderBy: { id: 'desc' },
      },
    );
  }
}
