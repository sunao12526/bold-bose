import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobLogController } from './job-log.controller';
import { JobHandlers } from './job.handlers';

@Module({
  controllers: [JobController, JobLogController],
  providers: [JobService, JobHandlers],
  exports: [JobService],
})
export class JobModule {}
