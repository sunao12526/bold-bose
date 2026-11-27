import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { paginateQuery } from '../../../shared/pagination';

export interface ApiErrorLogQuery {
  page?: number | string;
  pageSize?: number | string;
  userId?: number | string;
  requestUrl?: string;
  exceptionName?: string;
  processStatus?: number | string;
}

@Injectable()
export class ApiErrorLogService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(query?: ApiErrorLogQuery) {
    const where: any = {};
    if (query?.userId !== undefined && query.userId !== '') {
      where.userId = Number(query.userId);
    }
    if (query?.requestUrl) {
      where.requestUrl = { contains: query.requestUrl };
    }
    if (query?.exceptionName) {
      where.exceptionName = { contains: query.exceptionName };
    }
    if (query?.processStatus !== undefined && query.processStatus !== '') {
      where.processStatus = Number(query.processStatus);
    }
    return where;
  }

  async findAll(query?: ApiErrorLogQuery) {
    return paginateQuery(this.prisma, 'infraApiErrorLog', query || {}, {
      where: this.buildWhere(query),
      orderBy: { id: 'desc' },
    });
  }

  async findAllForExport(query?: ApiErrorLogQuery) {
    return this.prisma.infraApiErrorLog.findMany({
      where: this.buildWhere(query),
      orderBy: { id: 'desc' },
      take: 5000,
    });
  }

  async updateProcess(
    id: number,
    processStatus: number,
    processUserId?: number,
  ) {
    if (![1, 2].includes(processStatus)) {
      throw new BadRequestException('处理状态必须为 1(已处理) 或 2(已忽略)');
    }

    const existing = await this.prisma.infraApiErrorLog.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('异常日志不存在');
    }

    return this.prisma.infraApiErrorLog.update({
      where: { id },
      data: {
        processStatus,
        processTime: new Date(),
        processUserId: processUserId ?? null,
      },
    });
  }
}
