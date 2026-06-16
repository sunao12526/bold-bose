import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpMessageService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    if (query?.type) where.type = query.type;
    if (query?.openid) where.openid = { contains: query.openid };
    return this.prisma.mpMessage.findMany({ where, orderBy: { id: 'desc' }, take: 200 });
  }

  async findOne(id: number) {
    return this.prisma.mpMessage.findUnique({ where: { id } });
  }
}
