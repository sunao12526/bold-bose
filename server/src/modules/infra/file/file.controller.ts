import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @RequirePermissions('infra:file:create')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.upload(file);
  }

  @Get()
  @RequirePermissions('infra:file:query')
  async findAll() {
    return this.fileService.findAll();
  }

  @Delete(':id')
  @RequirePermissions('infra:file:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.remove(id);
  }
}
