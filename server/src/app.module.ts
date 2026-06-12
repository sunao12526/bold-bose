import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { InfraModule } from './modules/infra/infra.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { LogInterceptor } from './shared/interceptors/log.interceptor';

@Module({
  imports: [PrismaModule, AuthModule, SystemModule, InfraModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class AppModule {}
