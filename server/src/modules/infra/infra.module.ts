import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { CodegenModule } from './codegen/codegen.module';
import { JobModule } from './job/job.module';
import { LogController } from './log/log.controller';
import { LogService } from './log/log.service';

@Module({
  imports: [FileModule, CodegenModule, JobModule],
  controllers: [LogController],
  providers: [LogService],
  exports: [FileModule, CodegenModule, JobModule, LogService],
})
export class InfraModule {}
