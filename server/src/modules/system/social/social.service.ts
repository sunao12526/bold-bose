import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  // ================= SocialClient =================

  async findAllClients(query?: {
    page?: number | string;
    pageSize?: number | string;
    type?: string;
    status?: string;
  }) {
    const where: any = {};
    if (query?.type) {
      where.type = { contains: query.type, mode: 'insensitive' };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return paginateQuery(this.prisma, 'socialClient', query || {}, {
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOneClient(id: number) {
    const client = await this.prisma.socialClient.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException('社交应用配置不存在');
    }
    return client;
  }

  async createClient(data: {
    type: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    status?: 'ENABLE' | 'DISABLE';
  }) {
    const normalizedType = data.type.trim().toUpperCase();
    const existing = await this.prisma.socialClient.findUnique({
      where: { type: normalizedType },
    });
    if (existing) {
      throw new BadRequestException(`社交平台 [${normalizedType}] 配置已存在`);
    }
    return this.prisma.socialClient.create({
      data: {
        type: normalizedType,
        clientId: data.clientId,
        clientSecret: data.clientSecret,
        redirectUri: data.redirectUri,
        status: data.status ?? 'ENABLE',
      },
    });
  }

  async updateClient(
    id: number,
    data: {
      type?: string;
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
      status?: 'ENABLE' | 'DISABLE';
    },
  ) {
    await this.findOneClient(id);
    const updateData: any = { ...data };
    if (data.type) {
      const normalizedType = data.type.trim().toUpperCase();
      const dup = await this.prisma.socialClient.findFirst({
        where: { type: normalizedType, id: { not: id } },
      });
      if (dup) {
        throw new BadRequestException(`社交平台 [${normalizedType}] 配置已存在`);
      }
      updateData.type = normalizedType;
    }
    return this.prisma.socialClient.update({
      where: { id },
      data: updateData,
    });
  }

  async removeClient(id: number) {
    await this.findOneClient(id);
    return this.prisma.socialClient.delete({ where: { id } });
  }

  // ================= SocialUser =================

  async findAllUsers(query?: {
    page?: number | string;
    pageSize?: number | string;
    type?: string;
    nickname?: string;
    openid?: string;
    userId?: number | string;
  }) {
    const where: any = {};
    if (query?.type) {
      where.type = { contains: query.type, mode: 'insensitive' };
    }
    if (query?.nickname) {
      where.nickname = { contains: query.nickname, mode: 'insensitive' };
    }
    if (query?.openid) {
      where.openid = { contains: query.openid };
    }
    if (query?.userId !== undefined && query.userId !== '') {
      where.userId = Number(query.userId);
    }

    return paginateQuery(this.prisma, 'socialUser', query || {}, {
      where,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    });
  }

  async findOneUser(id: number) {
    const record = await this.prisma.socialUser.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    });
    if (!record) {
      throw new NotFoundException('社交用户绑定记录不存在');
    }
    return record;
  }

  async removeUser(id: number) {
    await this.findOneUser(id);
    return this.prisma.socialUser.delete({ where: { id } });
  }
}
