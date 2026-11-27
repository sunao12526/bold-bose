import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { SocialUserQueryDto } from './dto/social-manage.dto';
import { SocialService } from './social.service';

@ApiTags('系统 - 社交用户管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/social-user')
export class SocialUserController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  @RequirePermissions('system:social-user:query')
  @ApiOperation({ summary: '分页查询社交用户绑定列表' })
  async findAll(@Query() query: SocialUserQueryDto) {
    return this.socialService.findAllUsers(query);
  }

  @Get(':id')
  @RequirePermissions('system:social-user:query')
  @ApiOperation({ summary: '获取社交用户绑定详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.socialService.findOneUser(id);
  }

  @Delete(':id')
  @RequirePermissions('system:social-user:delete')
  @Log({ module: '社交用户', type: 'DELETE', description: '解绑社交用户' })
  @ApiOperation({ summary: '解绑社交用户' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.socialService.removeUser(id);
  }
}
