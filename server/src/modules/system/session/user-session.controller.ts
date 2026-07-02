import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserSessionService } from './user-session.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { UserSessionQueryDto } from '../dto/session-input.dto';
import { UserSessionResponseDto } from '../dto/session-response.dto';
import { SuccessResponseDto } from '../../auth/dto/auth-response.dto';

@ApiTags('系统 - 在线用户会话')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/user-session')
export class UserSessionController {
  constructor(private userSessionService: UserSessionService) {}

  @Get()
  @RequirePermissions('system:user-session:query')
  @ApiOperation({ summary: '查询所有在线用户会话' })
  @ApiOkResponse({ type: UserSessionResponseDto, isArray: true })
  async findAll(
    @Query() query: UserSessionQueryDto,
  ) {
    return this.userSessionService.findAll(query);
  }

  @Delete(':id')
  @RequirePermissions('system:user-session:delete')
  @Log({ module: '在线用户', type: 'DELETE', description: '强退用户会话' })
  @ApiOperation({ summary: '强退在线用户会话' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async kickout(@Param('id') id: string) {
    await this.userSessionService.kickout(id);
    return { success: true };
  }
}

