import { PrismaClient } from '@prisma/client';

export interface PaginationQuery {
  page?: string | number;
  pageSize?: string | number;
  [key: string]: any;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export async function paginateQuery<T>(
  prisma: any,
  model: string,
  query: PaginationQuery,
  options?: {
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
  },
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
  const skip = (page - 1) * pageSize;

  const where = options?.where || {};
  const orderBy = options?.orderBy || { id: 'desc' };

  const prismaModel = (prisma as any)[model];
  if (!prismaModel) {
    throw new Error(`Model "${model}" not found`);
  }

  const [items, total] = await Promise.all([
    prismaModel.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      ...(options?.include ? { include: options.include } : {}),
      ...(options?.select ? { select: options.select } : {}),
    }),
    prismaModel.count({ where }),
  ]);

  return { items, total };
}
