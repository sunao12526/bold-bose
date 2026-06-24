import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class SignInService {
  constructor(private prisma: PrismaService) {}

  async findAllConfigs() {
    return this.prisma.memberSignInConfig.findMany({
      orderBy: { day: 'asc' },
    });
  }

  async updateConfig(day: number, point: number, status?: CommonStatus) {
    const config = await this.prisma.memberSignInConfig.findUnique({
      where: { day },
    });
    if (!config) {
      return this.prisma.memberSignInConfig.create({
        data: {
          day,
          point: Number(point),
          status: status || CommonStatus.ENABLE,
        },
      });
    }
    return this.prisma.memberSignInConfig.update({
      where: { day },
      data: {
        point: Number(point),
        status,
      },
    });
  }

  async findAllRecords(query?: any) {
    const where: any = {};
    if (query?.memberId) {
      where.memberId = Number(query.memberId);
    }
    return this.prisma.memberSignInRecord.findMany({
      where,
      include: {
        member: { select: { id: true, nickname: true, mobile: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async signIn(memberId: number) {
    const member = await this.prisma.memberUser.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new NotFoundException('会员不存在');
    if (member.status !== CommonStatus.ENABLE) {
      throw new BadRequestException('该会员已被禁用，无法签到');
    }

    // Check if already signed in today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayRecord = await this.prisma.memberSignInRecord.findFirst({
      where: {
        memberId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (todayRecord) {
      throw new BadRequestException('今日已签到，请明天再来');
    }

    // Check if signed in yesterday (consecutive sign-in)
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);

    const yesterdayRecord = await this.prisma.memberSignInRecord.findFirst({
      where: {
        memberId,
        createdAt: {
          gte: yesterdayStart,
          lte: yesterdayEnd,
        },
      },
    });

    let nextConsecutiveDay = 1;
    if (yesterdayRecord) {
      nextConsecutiveDay = yesterdayRecord.day + 1;
      // If it exceeds maximum configuration day (7), wrap back to 1
      if (nextConsecutiveDay > 7) {
        nextConsecutiveDay = 1;
      }
    }

    // Find config for this day
    const config = await this.prisma.memberSignInConfig.findUnique({
      where: { day: nextConsecutiveDay },
    });

    let pointsRewarded =
      config && config.status === CommonStatus.ENABLE ? config.point : 0;

    if (pointsRewarded === 0) {
      const globalConfig = await this.prisma.memberConfig.findFirst();
      pointsRewarded = globalConfig ? globalConfig.signInPoint : 10;
    }

    return this.prisma.$transaction(async (tx) => {
      const record = await tx.memberSignInRecord.create({
        data: {
          memberId,
          day: nextConsecutiveDay,
          point: pointsRewarded,
        },
      });

      if (pointsRewarded > 0) {
        await tx.memberUser.update({
          where: { id: memberId },
          data: {
            points: { increment: pointsRewarded },
          },
        });
        await tx.memberPointRecord.create({
          data: {
            memberId,
            bizType: 'SIGN',
            bizId: String(record.id),
            point: pointsRewarded,
            afterPoint: member.points + pointsRewarded,
            operatorId: 'system',
            description: `每日签到奖励积分 +${pointsRewarded}`,
          },
        });
      }

      return {
        record,
        pointsRewarded,
        consecutiveDays: nextConsecutiveDay,
      };
    });
  }
}
