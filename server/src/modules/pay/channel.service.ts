import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class PayChannelService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(data: {
    appId: number;
    code: string;
    config: any;
    status?: CommonStatus;
    remark?: string;
  }) {
    // Verify pay app exists
    const app = await this.prisma.payApp.findUnique({
      where: { id: data.appId },
    });
    if (!app) {
      throw new NotFoundException('支付应用不存在');
    }

    // Check if configuration is valid JSON
    let parsedConfig = data.config;
    if (typeof data.config === 'string') {
      try {
        parsedConfig = JSON.parse(data.config);
      } catch (e) {
        throw new BadRequestException('配置参数必须是有效的 JSON 格式');
      }
    }

    const existing = await this.prisma.payChannel.findUnique({
      where: {
        appId_code: {
          appId: data.appId,
          code: data.code,
        },
      },
    });

    if (existing) {
      return this.prisma.payChannel.update({
        where: { id: existing.id },
        data: {
          config: parsedConfig,
          status: data.status,
          remark: data.remark,
        },
      });
    } else {
      return this.prisma.payChannel.create({
        data: {
          appId: data.appId,
          code: data.code,
          config: parsedConfig,
          status: data.status ?? CommonStatus.ENABLE,
          remark: data.remark,
        },
      });
    }
  }

  async findChannel(appId: number, code: string) {
    const channel = await this.prisma.payChannel.findUnique({
      where: {
        appId_code: {
          appId,
          code,
        },
      },
    });
    if (!channel) {
      throw new NotFoundException(`通道 [${code}] 配置不存在`);
    }
    return channel;
  }

  async findByApp(appId: number) {
    return this.prisma.payChannel.findMany({
      where: { appId },
      orderBy: { id: 'asc' },
    });
  }

  async remove(id: number) {
    const channel = await this.prisma.payChannel.findUnique({ where: { id } });
    if (!channel) throw new NotFoundException('支付通道不存在');
    return this.prisma.payChannel.delete({ where: { id } });
  }
}
