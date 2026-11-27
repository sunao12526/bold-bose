import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { CommonStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContext } from './tenant-context';

const TENANT_PUBLIC_BYPASS_PATHS = [
  '/system/tenant/get-id-by-name',
  '/system/tenant/get-by-website',
];

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const rawHeader =
      req.headers['tenant-id'] ?? req.headers['x-tenant-id'];
    const rawValue = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    let tenantId = 1;
    let explicitlyProvided = false;

    if (rawValue !== undefined && String(rawValue).trim() !== '') {
      explicitlyProvided = true;
      const parsed = Number(String(rawValue).trim());
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new BadRequestException('无效的租户编号');
      }
      tenantId = parsed;
    }

    const requestUrl = req.originalUrl || req.url || '';
    const isBypassPath = TENANT_PUBLIC_BYPASS_PATHS.some((p) =>
      requestUrl.includes(p),
    );

    // 显式传入非默认租户 ID 时校验租户状态与有效期
    if (explicitlyProvided && tenantId !== 1 && !isBypassPath) {
      const tenant = await TenantContext.runIgnore(() =>
        this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      );
      if (!tenant) {
        throw new ForbiddenException('租户不存在');
      }
      if (tenant.status !== CommonStatus.ENABLE) {
        throw new ForbiddenException('租户已被禁用');
      }
      if (tenant.expireTime && tenant.expireTime.getTime() < Date.now()) {
        throw new ForbiddenException('租户已过期');
      }
    }

    TenantContext.run(tenantId, () => next());
  }
}
