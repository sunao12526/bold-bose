import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpUserService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.keyword) {
      where.OR = [
        { nickname: { contains: query.keyword } },
        { openid: { contains: query.keyword } },
      ];
    }
    if (query?.subscribeStatus !== undefined) where.subscribeStatus = Number(query.subscribeStatus);
    return this.prisma.mpUser.findMany({ where, orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    return this.prisma.mpUser.findUnique({ where: { id } });
  }
}
