import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { InfraModule } from './modules/infra/infra.module';
import { MallModule } from './modules/mall/mall.module';
import { MemberModule } from './modules/member/member.module';
import { PayModule } from './modules/pay/pay.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { LogInterceptor } from './shared/interceptors/log.interceptor';

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    PrismaModule, 
    AuthModule, 
    SystemModule, 
    InfraModule, 
    MallModule,
    MemberModule,
    PayModule
  ],
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
