import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { UserSessionService } from './user-session.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/user-session')
export class UserSessionController {
  constructor(private userSessionService: UserSessionService) {}

  @Get()
  @RequirePermissions('system:user-session:query')
  async findAll(
    @Query('username') username?: string,
    @Query('ip') ip?: string,
  ) {
    return this.userSessionService.findAll({ username, ip });
  }

  @Delete(':id')
  @RequirePermissions('system:user-session:delete')
  @Log({ module: '在线用户', type: 'DELETE', description: '强退用户会话' })
  async kickout(@Param('id') id: string) {
    await this.userSessionService.kickout(id);
    return { success: true };
  }
}
