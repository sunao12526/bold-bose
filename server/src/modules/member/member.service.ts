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

  async findAll(query?: any) {
    const where: any = {};
    if (query) {
      if (query.nickname) {
        where.nickname = { contains: query.nickname, mode: 'insensitive' };
      }
      if (query.mobile) {
        where.mobile = { contains: query.mobile };
      }
      if (query.status) {
        where.status = query.status;
      }
      if (query.levelId) {
        where.levelId = Number(query.levelId);
      }
      if (query.groupId) {
        where.groupId = Number(query.groupId);
      }
    }

    // Default to pagination if page & pageSize are provided
    if (query && (query.page || query.pageSize)) {
      const page = Number(query.page || 1);
      const pageSize = Number(query.pageSize || 20);

      const [items, total] = await Promise.all([
        this.prisma.memberUser.findMany({
          where,
          include: {
            level: true,
            group: true,
          },
          orderBy: { id: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.prisma.memberUser.count({ where }),
      ]);
      return { items, total };
    }

    const items = await this.prisma.memberUser.findMany({
      where,
      include: {
        level: true,
        group: true,
      },
      orderBy: { id: 'desc' },
    });
    return { items, total: items.length };
  }

  async findOne(id: number) {
    const member = await this.prisma.memberUser.findUnique({
      where: { id },
      include: {
        level: true,
        group: true,
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
      include: { level: true, group: true },
    });
  }

  async adjustPoints(id: number, amount: number, operatorId?: string) {
    const member = await this.findOne(id);
    const newPoints = member.points + amount;
    if (newPoints < 0) {
      throw new BadRequestException('调整后的积分不能小于 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.memberUser.update({
        where: { id },
        data: { points: newPoints },
        include: { level: true, group: true },
      });

      await tx.memberPointRecord.create({
        data: {
          memberId: id,
          bizType: 'ADMIN',
          point: amount,
          afterPoint: newPoints,
          operatorId: operatorId || 'system',
          description: amount >= 0 ? `管理员调整：增加积分 +${amount}` : `管理员调整：扣减积分 ${amount}`,
        },
      });

      return updated;
    });
  }

  async adjustBalance(id: number, amountCents: number, operatorId?: string) {
    const member = await this.findOne(id);
    const newBalance = member.balance + amountCents;
    if (newBalance < 0) {
      throw new BadRequestException('调整后的余额不能小于 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.memberUser.update({
        where: { id },
        data: { balance: newBalance },
        include: { level: true, group: true },
      });

      await tx.memberBalanceRecord.create({
        data: {
          memberId: id,
          bizType: 'ADMIN',
          balance: amountCents,
          afterBalance: newBalance,
          operatorId: operatorId || 'system',
          description: amountCents >= 0 ? `管理员调整：账户充值 +${(amountCents / 100).toFixed(2)}元` : `管理员调整：账户扣减 ${(amountCents / 100).toFixed(2)}元`,
        },
      });

      return updated;
    });
  }

  async adjustExperience(id: number, amount: number, operatorId?: string) {
    const member = await this.findOne(id);
    const newExperience = member.experience + amount;
    if (newExperience < 0) {
      throw new BadRequestException('调整后的成长值不能小于 0');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const u = await tx.memberUser.update({
        where: { id },
        data: { experience: newExperience },
        include: { level: true, group: true },
      });

      await tx.memberExperienceRecord.create({
        data: {
          memberId: id,
          bizType: 'ADMIN',
          experience: amount,
          afterExperience: newExperience,
          operatorId: operatorId || 'system',
          description: amount >= 0 ? `管理员调整：增加成长值 +${amount}` : `管理员调整：扣减成长值 ${amount}`,
        },
      });

      return u;
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
      include: { level: true, group: true },
    });
  }

  async updateLevel(id: number, levelId: number | null, operatorId?: string) {
    const member = await this.findOne(id);
    const oldLevelId = member.levelId;
    const newLevelId = levelId;

    if (oldLevelId === newLevelId) {
      return member;
    }

    return this.prisma.$transaction(async (tx) => {
      let oldLevelName: string | null = null;
      if (oldLevelId) {
        const oldLevel = await tx.memberLevel.findUnique({ where: { id: oldLevelId } });
        oldLevelName = oldLevel ? oldLevel.name : null;
      }
      let newLevelName: string | null = null;
      if (newLevelId) {
        const newLevel = await tx.memberLevel.findUnique({ where: { id: newLevelId } });
        newLevelName = newLevel ? newLevel.name : null;
      }

      const updated = await tx.memberUser.update({
        where: { id },
        data: { levelId: newLevelId },
        include: { level: true, group: true },
      });

      await tx.memberLevelRecord.create({
        data: {
          memberId: id,
          oldLevelId,
          newLevelId,
          oldLevelName,
          newLevelName,
          experience: member.experience,
          operatorId: operatorId || 'system',
          description: `管理员手动调整等级: ${oldLevelName || '普通会员'} -> ${newLevelName || '普通会员'}`,
        },
      });

      return updated;
    });
  }

  async assignGroup(id: number, groupId: number | null) {
    await this.findOne(id);
    if (groupId) {
      const groupExists = await this.prisma.memberGroup.findUnique({
        where: { id: groupId },
      });
      if (!groupExists) throw new NotFoundException('会员分组不存在');
    }
    return this.prisma.memberUser.update({
      where: { id },
      data: { groupId },
      include: { level: true, group: true },
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
      const oldLevelId = member.levelId;
      const newLevelId = targetLevelId;

      await this.prisma.$transaction(async (tx) => {
        let oldLevelName: string | null = null;
        if (oldLevelId) {
          const oldLevel = await tx.memberLevel.findUnique({ where: { id: oldLevelId } });
          oldLevelName = oldLevel ? oldLevel.name : null;
        }
        let newLevelName: string | null = null;
        if (newLevelId) {
          const newLevel = await tx.memberLevel.findUnique({ where: { id: newLevelId } });
          newLevelName = newLevel ? newLevel.name : null;
        }

        await tx.memberUser.update({
          where: { id: memberId },
          data: { levelId: newLevelId },
        });

        await tx.memberLevelRecord.create({
          data: {
            memberId,
            oldLevelId,
            newLevelId,
            oldLevelName,
            newLevelName,
            experience: member.experience,
            operatorId: 'system',
            description: `成长值变动自动重新评定等级: ${oldLevelName || '普通会员'} -> ${newLevelName || '普通会员'}`,
          },
        });
      });
    }
  }
}
