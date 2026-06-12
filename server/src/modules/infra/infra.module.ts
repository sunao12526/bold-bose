import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { LogController } from './log/log.controller';
import { LogService } from './log/log.service';

@Module({
  imports: [FileModule],
  controllers: [LogController],
  providers: [LogService],
  exports: [FileModule, LogService],
})
export class InfraModule {}
