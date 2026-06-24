import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    let config = await this.prisma.memberConfig.findFirst();
    if (!config) {
      config = await this.prisma.memberConfig.create({
        data: {
          tradePointCashPercent: 10, // Default 10%
          tradePointGivePercent: 1,  // Default 1 point per yuan
          signInPoint: 10,           // Default 10 points
        },
      });
    }
    return config;
  }

  async saveConfig(data: any) {
    const current = await this.getConfig();
    return this.prisma.memberConfig.update({
      where: { id: current.id },
      data: {
        tradePointCashPercent: Number(data.tradePointCashPercent ?? current.tradePointCashPercent),
        tradePointGivePercent: Number(data.tradePointGivePercent ?? current.tradePointGivePercent),
        signInPoint: Number(data.signInPoint ?? current.signInPoint),
      },
    });
  }
}
