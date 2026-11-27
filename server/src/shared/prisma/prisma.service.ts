import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { TenantContext } from '../tenant/tenant-context';
import {
  applyTenantToArgs,
  TENANT_MODELS,
  verifyTenantResult,
} from './tenant-prisma.helper';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });

    const extended = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const tenantId = TenantContext.getTenantId();
            const ignore = TenantContext.isIgnore();
            const nextArgs = applyTenantToArgs(
              model,
              operation,
              args,
              tenantId,
              ignore,
            );
            const result = await query(nextArgs);
            return verifyTenantResult(model, operation, result, tenantId, ignore);
          },
        },
      },
    });

    for (const modelName of TENANT_MODELS) {
      const delegateKey =
        modelName.charAt(0).toLowerCase() + modelName.slice(1);
      Object.defineProperty(this, delegateKey, {
        get: () => (extended as any)[delegateKey],
        configurable: true,
        enumerable: true,
      });
    }

    Object.defineProperty(this, '$transaction', {
      value: (...args: any[]) => (extended as any).$transaction(...args),
      configurable: true,
      writable: true,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
