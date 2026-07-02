import { Controller, Get, Post, Delete, Param, Query, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpMaterialService } from './mp-material.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { MaterialQueryDto } from '../dto/material-query.dto';
import { MpMaterialResponseDto, MpMaterialListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 素材管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/material')
export class MpMaterialController {
  constructor(private service: MpMaterialService) {}

  @Get()
  @RequirePermissions('mp:material:query')
  @ApiOperation({ summary: '根据条件分页查询素材列表' })
  @ApiOkResponse({ type: MpMaterialListResponseDto })
  async findAll(@Query() query: MaterialQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:material:query')
  @ApiOperation({ summary: '根据 ID 获取素材详情' })
  @ApiOkResponse({ type: MpMaterialResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Post('upload-temporary')
  @RequirePermissions('mp:material:upload-temporary')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传微信临时素材' })
  async uploadTemporary(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('type') type: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const record = await this.service.uploadTemporary(
      accountId,
      type,
      file.buffer,
      file.originalname
    );
    return { data: record };
  }

  @Post('upload-permanent')
  @RequirePermissions('mp:material:upload-permanent')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '上传微信永久素材' })
  async uploadPermanent(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('title') title?: string,
    @Query('introduction') introduction?: string
  ) {
    const record = await this.service.uploadPermanent(
      accountId,
      type,
      file.buffer,
      file.originalname,
      title,
      introduction
    );
    return { data: record };
  }

  @Delete('delete-permanent')
  @RequirePermissions('mp:material:delete')
  @Log({ module: '素材管理', type: 'DELETE', description: '删除素材' })
  @ApiOperation({ summary: '删除公众号素材' })
  async remove(@Query('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { data: true };
  }
}

