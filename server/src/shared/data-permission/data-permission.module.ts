import { Global, Module } from '@nestjs/common';
import { DataPermissionService } from './data-permission.service';

@Global()
@Module({
  providers: [DataPermissionService],
  exports: [DataPermissionService],
})
export class DataPermissionModule {}
