import { Controller, Get, Put, Post, Body, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Log } from '../../shared/decorators/log.decorator';
import { FileService } from '../infra/file/file.service';
import { UpdateProfileDto, UpdatePasswordDto } from './dto/profile-input.dto';
import { ProfileResponseDto, ProfileUpdateResponseDto, UploadAvatarResponseDto } from './dto/profile-response.dto';
import { SuccessResponseDto } from '../auth/dto/auth-response.dto';

@ApiTags('系统 - 个人中心')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('system/user/profile')
export class ProfileController {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取当前登录用户个人资料' })
  @ApiOkResponse({ type: ProfileResponseDto })
  async getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Put()
  @Log({ module: '个人中心', type: 'UPDATE', description: '修改基本资料' })
  @ApiOperation({ summary: '修改当前登录用户基本资料' })
  @ApiOkResponse({ type: ProfileUpdateResponseDto })
  async updateProfile(@Req() req: any, @Body() data: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, data);
  }

  @Put('update-password')
  @Log({ module: '个人中心', type: 'UPDATE', description: '修改登录密码' })
  @ApiOperation({ summary: '修改当前登录用户密码' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async updatePassword(@Req() req: any, @Body() data: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, data);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '头像图片文件',
        },
      },
      required: ['file'],
    },
  })
  @Log({ module: '个人中心', type: 'UPDATE', description: '上传头像' })
  @ApiOperation({ summary: '上传并修改头像' })
  @ApiOkResponse({ type: UploadAvatarResponseDto })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const fileRecord = await this.fileService.upload(file);
    await this.userService.updateProfile(req.user.id, { nickname: req.user.nickname, avatar: fileRecord.url });
    return { url: fileRecord.url };
  }
}

