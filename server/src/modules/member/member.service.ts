import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.memberUser.findMany({
      include: {
        level: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const member = await this.prisma.memberUser.findUnique({
      where: { id },
      include: {
        level: true,
      },
    });
    if (!member) throw new NotFoundException('会员不存在');
    return member;
  }

  async updateStatus(id: number, status: CommonStatus) {
    await this.findOne(id);
    return this.prisma.memberUser.update({
      where: { id },
      data: { status },
      include: { level: true },
    });
  }

  async adjustPoints(id: number, amount: number) {
    const member = await this.findOne(id);
    const newPoints = member.points + amount;
    if (newPoints < 0) {
      throw new BadRequestException('调整后的积分不能小于 0');
    }
    return this.prisma.memberUser.update({
      where: { id },
      data: { points: newPoints },
      include: { level: true },
    });
  }

  async adjustBalance(id: number, amountCents: number) {
    const member = await this.findOne(id);
    const newBalance = member.balance + amountCents;
    if (newBalance < 0) {
      throw new BadRequestException('调整后的余额不能小于 0');
    }
    return this.prisma.memberUser.update({
      where: { id },
      data: { balance: newBalance },
      include: { level: true },
    });
  }

  async adjustExperience(id: number, amount: number) {
    const member = await this.findOne(id);
    const newExperience = member.experience + amount;
    if (newExperience < 0) {
      throw new BadRequestException('调整后的成长值不能小于 0');
    }

    await this.prisma.memberUser.update({
      where: { id },
      data: { experience: newExperience },
    });

    await this.updateMemberLevel(id);
    return this.findOne(id);
  }

  async assignTags(id: number, tagIds: number[]) {
    await this.findOne(id);
    return this.prisma.memberUser.update({
      where: { id },
      data: {
        tagIds: tagIds || null,
      },
      include: { level: true },
    });
  }

  async updateMemberLevel(memberId: number) {
    const member = await this.prisma.memberUser.findUnique({
      where: { id: memberId },
    });
    if (!member) return;

    // Find all active levels
    const levels = await this.prisma.memberLevel.findMany({
      where: { status: CommonStatus.ENABLE },
      orderBy: { experience: 'desc' },
    });

    // Find the level they qualify for (highest experience threshold <= member.experience)
    const matchedLevel = levels.find((l) => member.experience >= l.experience);
    const targetLevelId = matchedLevel ? matchedLevel.id : null;

    if (member.levelId !== targetLevelId) {
      await this.prisma.memberUser.update({
        where: { id: memberId },
        data: { levelId: targetLevelId },
      });
    }
  }
}
