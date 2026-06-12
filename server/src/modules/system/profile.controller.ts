import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard)
@Controller('system/user/profile')
export class ProfileController {
  constructor(private userService: UserService) {}

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
}
