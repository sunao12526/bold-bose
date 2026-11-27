import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RedisService } from '../../../shared/redis/redis.service';

const OAUTH2_CODE_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createClient(data: any) {
    return this.prisma.oAuth2Client.create({
      data: {
        clientId: data.clientId,
        secret: data.secret,
        name: data.name,
        logo: data.logo || null,
        redirectUris:
          typeof data.redirectUris === 'string'
            ? data.redirectUris
            : JSON.stringify(data.redirectUris || []),
        scopes:
          typeof data.scopes === 'string'
            ? data.scopes
            : JSON.stringify(data.scopes || []),
        status: data.status || 'ENABLE',
      },
    });
  }

  async findAllClients(query?: any) {
    const where: any = {};
    if (query?.clientId) {
      where.clientId = { contains: query.clientId };
    }
    if (query?.name) {
      where.name = { contains: query.name };
    }
    if (query?.status) {
      where.status = query.status;
    }
    return this.prisma.oAuth2Client.findMany({
      where,
      orderBy: { id: 'desc' },
    });
  }

  async findOneClient(id: number) {
    const record = await this.prisma.oAuth2Client.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('OAuth2 客户端不存在');
    return record;
  }

  async updateClient(id: number, data: any) {
    await this.findOneClient(id);
    return this.prisma.oAuth2Client.update({
      where: { id },
      data: {
        clientId: data.clientId,
        secret: data.secret,
        name: data.name,
        logo: data.logo,
        redirectUris:
          data.redirectUris !== undefined
            ? typeof data.redirectUris === 'string'
              ? data.redirectUris
              : JSON.stringify(data.redirectUris)
            : undefined,
        scopes:
          data.scopes !== undefined
            ? typeof data.scopes === 'string'
              ? data.scopes
              : JSON.stringify(data.scopes)
            : undefined,
        status: data.status,
      },
    });
  }

  async removeClient(id: number) {
    await this.findOneClient(id);
    return this.prisma.oAuth2Client.delete({ where: { id } });
  }

  async generateCode(
    userId: number,
    clientId: string,
    scopes: string[],
  ): Promise<string> {
    const code = crypto.randomBytes(24).toString('hex');
    await this.redisService.setJson(
      `oauth2:code:${code}`,
      { userId, clientId, scopes },
      OAUTH2_CODE_TTL_MS,
    );
    return code;
  }

  async verifyCode(
    code: string,
    clientId: string,
  ): Promise<{ userId: number; scopes: string[] }> {
    const raw = await this.redisService.getAndDelete(`oauth2:code:${code}`);
    if (!raw) {
      throw new Error('授权码无效或已过期');
    }
    const payload = JSON.parse(raw) as {
      userId: number;
      clientId: string;
      scopes: string[];
    };
    if (payload.clientId !== clientId) {
      throw new Error('授权码不匹配客户端');
    }
    return { userId: payload.userId, scopes: payload.scopes };
  }
}
