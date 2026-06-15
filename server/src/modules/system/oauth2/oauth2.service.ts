import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class OAuth2Service {
  constructor(private readonly prisma: PrismaService) {}

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

  private codes = new Map<
    string,
    { userId: number; clientId: string; scopes: string[] }
  >();

  async generateCode(
    userId: number,
    clientId: string,
    scopes: string[],
  ): Promise<string> {
    const code =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.codes.set(code, { userId, clientId, scopes });
    setTimeout(() => this.codes.delete(code), 10 * 60 * 1000);
    return code;
  }

  async verifyCode(
    code: string,
    clientId: string,
  ): Promise<{ userId: number; scopes: string[] }> {
    const payload = this.codes.get(code);
    if (!payload) {
      throw new Error('授权码无效或已过期');
    }
    if (payload.clientId !== clientId) {
      throw new Error('授权码不匹配客户端');
    }
    this.codes.delete(code);
    return { userId: payload.userId, scopes: payload.scopes };
  }
}
