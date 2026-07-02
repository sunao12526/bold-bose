import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SignInService } from './sign-in.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import {
  UpdateSignInConfigDto,
  SignInRecordQueryDto,
} from './dto/member-input.dto';
import {
  MemberSignInConfigResponseDto,
  MemberSignInRecordResponseDto,
  MemberSignInRecordListResponseDto,
} from './dto/member-response.dto';

@ApiTags('会员 - 签到管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member')
export class SignInController {
  constructor(private signInService: SignInService) {}

  @Get('sign-in-config')
  @RequirePermissions('member:sign-in-config:query')
  @ApiOperation({ summary: '获取全部签到奖励配置' })
  @ApiOkResponse({ type: MemberSignInConfigResponseDto, isArray: true })
  async findAllConfigs() {
    return this.signInService.findAllConfigs();
  }

  @Put('sign-in-config/:day')
  @RequirePermissions('member:sign-in-config:update')
  @Log({ module: '签到规则', type: 'UPDATE', description: '修改签到奖励配置' })
  @ApiOperation({ summary: '修改签到第几天的奖励及状态配置' })
  @ApiOkResponse({ type: MemberSignInConfigResponseDto })
  async updateConfig(
    @Param('day', ParseIntPipe) day: number,
    @Body() body: UpdateSignInConfigDto,
  ) {
    return this.signInService.updateConfig(day, body.point, body.status);
  }

  @Get('sign-in-record')
  @RequirePermissions('member:sign-in-record:query')
  @ApiOperation({ summary: '分页查询签到记录列表' })
  @ApiOkResponse({ type: MemberSignInRecordListResponseDto })
  async findAllRecords(@Query() query: SignInRecordQueryDto) {
    return this.signInService.findAllRecords(query);
  }

  @Post('user/:id/sign-in')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'CREATE', description: '模拟会员每日签到' })
  @ApiOperation({ summary: '模拟指定会员进行每日签到' })
  @ApiOkResponse({ type: MemberSignInRecordResponseDto })
  async signIn(@Param('id', ParseIntPipe) id: number) {
    return this.signInService.signIn(id);
  }
}

