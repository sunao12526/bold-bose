import { Controller, Get, Put, Post, Body, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Log } from '../../shared/decorators/log.decorator';
import { FileService } from '../infra/file/file.service';

@UseGuards(JwtAuthGuard)
@Controller('system/user/profile')
export class ProfileController {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  @Get()
  async getProfile(@Req() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Put()
  @Log({ module: '个人中心', type: 'UPDATE', description: '修改基本资料' })
  async updateProfile(@Req() req: any, @Body() data: any) {
    return this.userService.updateProfile(req.user.id, data);
  }

  @Put('update-password')
  @Log({ module: '个人中心', type: 'UPDATE', description: '修改登录密码' })
  async updatePassword(@Req() req: any, @Body() data: any) {
    return this.userService.updatePassword(req.user.id, data);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @Log({ module: '个人中心', type: 'UPDATE', description: '上传头像' })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const fileRecord = await this.fileService.upload(file);
    await this.userService.updateProfile(req.user.id, { nickname: req.user.nickname, avatar: fileRecord.url });
    return { url: fileRecord.url };
  }
}
