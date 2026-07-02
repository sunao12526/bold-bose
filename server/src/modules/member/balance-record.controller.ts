import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BalanceRecordService } from './balance-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { SignInRecordQueryDto } from './dto/member-input.dto';
import { MemberBalanceRecordListResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 余额变动记录')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/balance-record')
export class BalanceRecordController {
  constructor(private balanceRecordService: BalanceRecordService) {}

  @Get()
  @RequirePermissions('member:sign-in-record:query') // 复用已有的签到日志查询权限
  @ApiOperation({ summary: '分页查询余额变动记录列表' })
  @ApiOkResponse({ type: MemberBalanceRecordListResponseDto })
  async findAll(@Query() query: SignInRecordQueryDto) {
    return this.balanceRecordService.findAll(query);
  }
}

