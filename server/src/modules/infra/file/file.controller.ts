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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { FileResponseDto } from '../dto/file-response.dto';

@ApiTags('基础设施 - 文件管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @RequirePermissions('infra:file:create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '上传的文件',
        },
      },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: '上传文件' })
  @ApiOkResponse({ type: FileResponseDto })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.upload(file);
  }

  @Get()
  @RequirePermissions('infra:file:query')
  @ApiOperation({ summary: '获取所有文件列表' })
  @ApiOkResponse({ type: FileResponseDto, isArray: true })
  async findAll() {
    return this.fileService.findAll();
  }

  @Delete(':id')
  @RequirePermissions('infra:file:delete')
  @ApiOperation({ summary: '删除文件' })
  @ApiOkResponse({ type: FileResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.remove(id);
  }
}

