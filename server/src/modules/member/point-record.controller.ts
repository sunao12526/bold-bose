import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PointRecordService } from './point-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { SignInRecordQueryDto } from './dto/member-input.dto';
import { MemberPointRecordListResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 积分变动记录')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/point-record')
export class PointRecordController {
  constructor(private pointRecordService: PointRecordService) {}

  @Get()
  @RequirePermissions('member:sign-in-record:query') // 复用已有的签到日志查询权限
  @ApiOperation({ summary: '分页查询积分变动记录列表' })
  @ApiOkResponse({ type: MemberPointRecordListResponseDto })
  async findAll(@Query() query: SignInRecordQueryDto) {
    return this.pointRecordService.findAll(query);
  }
}

