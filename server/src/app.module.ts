import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { InfraModule } from './modules/infra/infra.module';
import { MallModule } from './modules/mall/mall.module';
import { MemberModule } from './modules/member/member.module';
import { CmsModule } from './modules/cms/cms.module';
import { MpModule } from './modules/mp/mp.module';
import { HealthRdModule } from './modules/health-rd/health-rd.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { ApiAccessLogInterceptor } from './shared/interceptors/api-access-log.interceptor';
import { IdempotentInterceptor } from './shared/interceptors/idempotent.interceptor';
import { LogInterceptor } from './shared/interceptors/log.interceptor';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { DataPermissionModule } from './shared/data-permission/data-permission.module';
import { ExcelModule } from './shared/excel/excel.module';
import { RedisModule } from './shared/redis/redis.module';
import { RedisService } from './shared/redis/redis.service';
import { RedisThrottlerStorage } from './shared/redis/redis-throttler.storage';
import { TenantMiddleware } from './shared/tenant/tenant.middleware';
import { UserCacheModule } from './shared/user-cache.module';
import { IpModule } from './shared/ip/ip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    ThrottlerModule.forRootAsync({
      inject: [RedisService],
      useFactory: (redisService: RedisService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 60,
          },
        ],
        storage: new RedisThrottlerStorage(redisService),
      }),
    }),
    ScheduleModule.forRoot(), 
    PrismaModule,
    DataPermissionModule,
    ExcelModule,
    UserCacheModule,
    IpModule,
    AuthModule, 
    SystemModule, 
    InfraModule, 
    MallModule,
    MemberModule,
    CmsModule,
    MpModule,
    HealthRdModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiAccessLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotentInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
