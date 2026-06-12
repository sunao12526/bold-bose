import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';
import { MemberService } from './member.service';

@Injectable()
export class LevelService {
  constructor(
    private prisma: PrismaService,
    private memberService: MemberService,
  ) {}

  async create(data: any) {
    const existing = await this.prisma.memberLevel.findUnique({
      where: { level: Number(data.level) },
    });
    if (existing) {
      throw new BadRequestException(`等级值 [${data.level}] 已存在`);
    }

    const level = await this.prisma.memberLevel.create({
      data: {
        name: data.name,
        level: Number(data.level),
        experience: Number(data.experience),
        discountPercent: Number(data.discountPercent || 100),
        status: data.status || CommonStatus.ENABLE,
      },
    });

    await this.recalculateAllUsersLevels();
    return level;
  }

  async findAll() {
    return this.prisma.memberLevel.findMany({
      orderBy: { level: 'asc' },
    });
  }

  async findOne(id: number) {
    const level = await this.prisma.memberLevel.findUnique({
      where: { id },
    });
    if (!level) throw new NotFoundException('会员等级不存在');
    return level;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    if (data.level !== undefined) {
      const existing = await this.prisma.memberLevel.findFirst({
        where: {
          level: Number(data.level),
          id: { not: id },
        },
      });
      if (existing) {
        throw new BadRequestException(`等级值 [${data.level}] 已存在`);
      }
    }

    const level = await this.prisma.memberLevel.update({
      where: { id },
      data: {
        name: data.name,
        level: data.level !== undefined ? Number(data.level) : undefined,
        experience: data.experience !== undefined ? Number(data.experience) : undefined,
        discountPercent: data.discountPercent !== undefined ? Number(data.discountPercent) : undefined,
        status: data.status,
      },
    });

    await this.recalculateAllUsersLevels();
    return level;
  }

  async remove(id: number) {
    await this.findOne(id);
    const result = await this.prisma.memberLevel.delete({
      where: { id },
    });
    await this.recalculateAllUsersLevels();
    return result;
  }

  private async recalculateAllUsersLevels() {
    const members = await this.prisma.memberUser.findMany();
    for (const member of members) {
      await this.memberService.updateMemberLevel(member.id);
    }
  }
}
