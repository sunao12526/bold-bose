import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantPackageController } from './tenant-package.controller';
import { TenantPackageService } from './tenant-package.service';

@Module({
  controllers: [TenantController, TenantPackageController],
  providers: [TenantService, TenantPackageService],
  exports: [TenantService, TenantPackageService],
})
export class TenantModule {}
