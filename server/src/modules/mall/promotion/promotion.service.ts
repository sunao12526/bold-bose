import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CommonStatus, MallCouponValidityType, MallCouponUserStatus } from '@prisma/client';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { scopeValue, ...rest } = data;
    return this.prisma.mallCoupon.create({
      data: {
        ...rest,
        scopeValue: scopeValue || null,
      },
    });
  }

  async findAll() {
    return this.prisma.mallCoupon.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const coupon = await this.prisma.mallCoupon.findUnique({
      where: { id },
    });
    if (!coupon) throw new NotFoundException('优惠券模板不存在');
    return coupon;
  }

  async updateStatus(id: number, status: CommonStatus) {
    await this.findOne(id);
    return this.prisma.mallCoupon.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mallCoupon.delete({
      where: { id },
    });
  }

  async sendCoupon(couponId: number, memberIds: number[]) {
    const coupon = await this.findOne(couponId);
    if (coupon.status !== CommonStatus.ENABLE) {
      throw new BadRequestException('该优惠券模板未启用，无法分发');
    }

    if (memberIds.length === 0) {
      throw new BadRequestException('请选择要分发的会员');
    }

    return this.prisma.$transaction(async (tx) => {
      const results: any[] = [];
      for (const memberId of memberIds) {
        // Double-check current claimed count in transaction
        const currentCoupon = await tx.mallCoupon.findUnique({
          where: { id: couponId },
        });
        if (!currentCoupon) throw new NotFoundException('优惠券模板不存在');
        
        if (currentCoupon.takeCount >= currentCoupon.totalCount) {
          throw new BadRequestException(`优惠券 [${currentCoupon.name}] 库存不足，分发终止`);
        }

        // Check if member exists
        const member = await tx.memberUser.findUnique({ where: { id: memberId } });
        if (!member) throw new NotFoundException(`会员(ID: ${memberId})不存在`);

        // Compute valid range
        let validStartTime: Date;
        let validEndTime: Date;

        if (currentCoupon.validityType === MallCouponValidityType.DATE) {
          if (!currentCoupon.validStartTime || !currentCoupon.validEndTime) {
            throw new BadRequestException('固定时间类型的优惠券必须配置起止日期');
          }
          validStartTime = currentCoupon.validStartTime;
          validEndTime = currentCoupon.validEndTime;
        } else {
          const days = currentCoupon.validDays || 1;
          validStartTime = new Date();
          validEndTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        }

        // Create coupon instance
        const userCoupon = await tx.mallCouponUser.create({
          data: {
            couponId,
            memberId,
            status: MallCouponUserStatus.UNUSED,
            validStartTime,
            validEndTime,
          },
        });

        // Increment takeCount
        await tx.mallCoupon.update({
          where: { id: couponId },
          data: {
            takeCount: { increment: 1 },
          },
        });

        results.push(userCoupon);
      }
      return results;
    });
  }

  async findAllUserCoupons() {
    return this.prisma.mallCouponUser.findMany({
      include: {
        coupon: true,
        member: { select: { id: true, nickname: true, mobile: true } },
      },
      orderBy: { id: 'desc' },
    });
  }
}
