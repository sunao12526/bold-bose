import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { CodegenModule } from './codegen/codegen.module';
import { JobModule } from './job/job.module';
import { LogController } from './log/log.controller';
import { LogService } from './log/log.service';
import { ApiAccessLogController } from './api-log/api-access-log.controller';
import { ApiAccessLogService } from './api-log/api-access-log.service';
import { ApiErrorLogController } from './api-log/api-error-log.controller';
import { ApiErrorLogService } from './api-log/api-error-log.service';
import { RedisMonitorController } from './redis/redis-monitor.controller';
import { SseController } from './sse/sse.controller';

@Module({
  imports: [FileModule, CodegenModule, JobModule],
  controllers: [
    LogController,
    ApiAccessLogController,
    ApiErrorLogController,
    RedisMonitorController,
    SseController,
  ],
  providers: [LogService, ApiAccessLogService, ApiErrorLogService],
  exports: [
    FileModule,
    CodegenModule,
    JobModule,
    LogService,
    ApiAccessLogService,
    ApiErrorLogService,
  ],
})
export class InfraModule {}
