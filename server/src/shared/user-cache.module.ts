import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UserCacheService } from './user-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 300000, // 5 minutes in milliseconds
    }),
  ],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class UserCacheModule {}
