import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommonStatus, PayOrderStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

export const WalletBizType = {
  RECHARGE: 1,
  RECHARGE_REFUND: 2,
  PAYMENT: 3,
  PAYMENT_REFUND: 4,
  ADMIN_ADJUST: 5,
} as const;

@Injectable()
export class PayWalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateWallet(userId: number, userType = 1) {
    let wallet = await this.prisma.payWallet.findUnique({
      where: { userId_userType: { userId, userType } },
    });
    if (!wallet) {
      wallet = await this.prisma.payWallet.create({
        data: { userId, userType },
      });
    }
    return wallet;
  }

  private generateTxNo(prefix = 'WLT'): string {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  async addBalance(
    walletId: number,
    price: number,
    bizType: number,
    bizId: string,
    title: string,
  ) {
    if (price <= 0) {
      throw new BadRequestException('入账金额必须大于 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.payWallet.findUnique({ where: { id: walletId } });
      if (!wallet) {
        throw new NotFoundException('钱包不存在');
      }

      const newBalance = wallet.balance + price;
      const updated = await tx.payWallet.update({
        where: { id: walletId },
        data: {
          balance: newBalance,
          ...(bizType === WalletBizType.RECHARGE
            ? { totalRecharge: { increment: price } }
            : {}),
        },
      });

      const transaction = await tx.payWalletTransaction.create({
        data: {
          walletId,
          bizType,
          bizId,
          no: this.generateTxNo(),
          title,
          price,
          balance: newBalance,
        },
      });

      return { wallet: updated, transaction };
    });
  }

  async reduceBalance(
    walletId: number,
    price: number,
    bizType: number,
    bizId: string,
    title: string,
  ) {
    if (price <= 0) {
      throw new BadRequestException('扣款金额必须大于 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.payWallet.findUnique({ where: { id: walletId } });
      if (!wallet) {
        throw new NotFoundException('钱包不存在');
      }
      if (wallet.balance < price) {
        throw new BadRequestException('钱包余额不足');
      }

      const newBalance = wallet.balance - price;
      const updated = await tx.payWallet.update({
        where: { id: walletId },
        data: {
          balance: newBalance,
          ...(bizType === WalletBizType.PAYMENT
            ? { totalExpense: { increment: price } }
            : {}),
        },
      });

      const transaction = await tx.payWalletTransaction.create({
        data: {
          walletId,
          bizType,
          bizId,
          no: this.generateTxNo(),
          title,
          price: -price,
          balance: newBalance,
        },
      });

      return { wallet: updated, transaction };
    });
  }

  async adjustBalanceByAdmin(
    userId: number,
    userType: number,
    price: number,
    title: string,
  ) {
    const wallet = await this.getOrCreateWallet(userId, userType);
    if (price > 0) {
      return this.addBalance(
        wallet.id,
        price,
        WalletBizType.ADMIN_ADJUST,
        `ADMIN_${Date.now()}`,
        title,
      );
    }
    return this.reduceBalance(
      wallet.id,
      Math.abs(price),
      WalletBizType.ADMIN_ADJUST,
      `ADMIN_${Date.now()}`,
      title,
    );
  }

  async findAllWallets(query?: {
    page?: number | string;
    pageSize?: number | string;
    userId?: number | string;
    userType?: number | string;
  }) {
    const where: any = {};
    if (query?.userId !== undefined && query.userId !== '') {
      where.userId = Number(query.userId);
    }
    if (query?.userType !== undefined && query.userType !== '') {
      where.userType = Number(query.userType);
    }
    return paginateQuery(this.prisma, 'payWallet', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findTransactions(query: {
    page?: number | string;
    pageSize?: number | string;
    walletId?: number | string;
  }) {
    const where: any = {};
    if (query?.walletId !== undefined && query.walletId !== '') {
      where.walletId = Number(query.walletId);
    }
    return paginateQuery(this.prisma, 'payWalletTransaction', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  // ==================== 充值套餐 ====================

  async findRechargePackages(onlyEnable = false) {
    return this.prisma.payWalletRechargePackage.findMany({
      where: onlyEnable ? { status: CommonStatus.ENABLE } : undefined,
      orderBy: { payPrice: 'asc' },
    });
  }

  async createRechargePackage(data: {
    name: string;
    payPrice: number;
    bonusPrice?: number;
    status?: CommonStatus;
  }) {
    return this.prisma.payWalletRechargePackage.create({
      data: {
        name: data.name,
        payPrice: data.payPrice,
        bonusPrice: data.bonusPrice ?? 0,
        status: data.status ?? CommonStatus.ENABLE,
      },
    });
  }

  async updateRechargePackage(
    id: number,
    data: {
      name?: string;
      payPrice?: number;
      bonusPrice?: number;
      status?: CommonStatus;
    },
  ) {
    const existing = await this.prisma.payWalletRechargePackage.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('充值套餐不存在');
    return this.prisma.payWalletRechargePackage.update({
      where: { id },
      data,
    });
  }

  async removeRechargePackage(id: number) {
    const existing = await this.prisma.payWalletRechargePackage.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('充值套餐不存在');
    return this.prisma.payWalletRechargePackage.delete({ where: { id } });
  }

  // ==================== C端充值单 ====================

  async createRecharge(
    userId: number,
    data: { packageId?: number; payPrice?: number },
  ) {
    let payPrice = data.payPrice ?? 0;
    let bonusPrice = 0;

    if (data.packageId) {
      const pkg = await this.prisma.payWalletRechargePackage.findUnique({
        where: { id: data.packageId },
      });
      if (!pkg || pkg.status !== CommonStatus.ENABLE) {
        throw new BadRequestException('充值套餐不存在或已禁用');
      }
      payPrice = pkg.payPrice;
      bonusPrice = pkg.bonusPrice;
    }

    if (!payPrice || payPrice <= 0) {
      throw new BadRequestException('充值金额必须大于 0');
    }

    const wallet = await this.getOrCreateWallet(userId, 1);

    let payApp = await this.prisma.payApp.findUnique({
      where: { code: 'wallet_app' },
    });
    if (!payApp || payApp.status !== CommonStatus.ENABLE) {
      payApp = await this.prisma.payApp.findFirst({
        where: { status: CommonStatus.ENABLE },
        orderBy: { id: 'asc' },
      });
    }
    if (!payApp) {
      throw new BadRequestException('请先配置启用的支付应用');
    }

    const apiBase =
      process.env.API_BASE_URL || 'http://localhost:3000/admin-api';

    return this.prisma.$transaction(async (tx) => {
      const recharge = await tx.payWalletRecharge.create({
        data: {
          walletId: wallet.id,
          totalPrice: payPrice + bonusPrice,
          payPrice,
          bonusPrice,
          packageId: data.packageId ?? null,
          payStatus: false,
        },
      });

      const payOrder = await tx.payOrder.create({
        data: {
          appId: payApp.id,
          merchantOrderId: `RECHARGE_${recharge.id}`,
          subject: `钱包充值 ¥${(payPrice / 100).toFixed(2)}`,
          price: payPrice,
          status: PayOrderStatus.UNPAID,
          merchantNotifyUrl: `${apiBase}/pay/notify/wallet-recharge`,
          expireTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      });

      await tx.payWalletRecharge.update({
        where: { id: recharge.id },
        data: { payOrderId: payOrder.id },
      });

      return {
        id: recharge.id,
        payOrderId: payOrder.id,
      };
    });
  }

  async updateRechargePaid(
    rechargeId: number,
    payOrderId: number,
    channelCode?: string,
  ) {
    const recharge = await this.prisma.payWalletRecharge.findUnique({
      where: { id: rechargeId },
    });
    if (!recharge) {
      throw new NotFoundException('钱包充值单不存在');
    }
    if (recharge.payStatus) {
      return recharge;
    }

    await this.prisma.payWalletRecharge.update({
      where: { id: rechargeId },
      data: {
        payStatus: true,
        payOrderId,
        payChannelCode: channelCode ?? null,
        payTime: new Date(),
      },
    });

    await this.addBalance(
      recharge.walletId,
      recharge.totalPrice,
      WalletBizType.RECHARGE,
      String(recharge.id),
      `钱包充值 (实付 ${(recharge.payPrice / 100).toFixed(2)} 元${recharge.bonusPrice > 0 ? `, 赠送 ${(recharge.bonusPrice / 100).toFixed(2)} 元` : ''})`,
    );

    return this.prisma.payWalletRecharge.findUnique({
      where: { id: rechargeId },
    });
  }
}
