import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

export interface ApiAccessLogQuery {
  page?: number | string;
  pageSize?: number | string;
  userId?: number | string;
  userType?: number | string;
  requestMethod?: string;
  requestUrl?: string;
  resultCode?: number | string;
}

@Injectable()
export class ApiAccessLogService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(query?: ApiAccessLogQuery) {
    const where: any = {};
    if (query?.userId !== undefined && query.userId !== '') {
      where.userId = Number(query.userId);
    }
    if (query?.userType !== undefined && query.userType !== '') {
      where.userType = Number(query.userType);
    }
    if (query?.requestMethod) {
      where.requestMethod = query.requestMethod.toUpperCase();
    }
    if (query?.requestUrl) {
      where.requestUrl = { contains: query.requestUrl };
    }
    if (query?.resultCode !== undefined && query.resultCode !== '') {
      where.resultCode = Number(query.resultCode);
    }
    return where;
  }

  async findAll(query?: ApiAccessLogQuery) {
    return paginateQuery(this.prisma, 'infraApiAccessLog', query || {}, {
      where: this.buildWhere(query),
      orderBy: { id: 'desc' },
    });
  }

  async findAllForExport(query?: ApiAccessLogQuery) {
    return this.prisma.infraApiAccessLog.findMany({
      where: this.buildWhere(query),
      orderBy: { id: 'desc' },
      take: 5000,
    });
  }
}
