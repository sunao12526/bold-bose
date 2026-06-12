import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileConfigService } from './file-config.service';
import { FileConfigController } from './file-config.controller';

@Module({
  providers: [FileService, FileConfigService],
  controllers: [FileController, FileConfigController],
  exports: [FileService, FileConfigService],
})
export class FileModule {}
