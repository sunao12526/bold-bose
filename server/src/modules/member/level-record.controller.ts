import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LevelRecordService } from './level-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { SignInRecordQueryDto } from './dto/member-input.dto';
import { MemberLevelRecordListResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 会员等级变更记录')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/level-record')
export class LevelRecordController {
  constructor(private levelRecordService: LevelRecordService) {}

  @Get()
  @RequirePermissions('member:user:query')
  @ApiOperation({ summary: '分页查询会员等级变更记录列表' })
  @ApiOkResponse({ type: MemberLevelRecordListResponseDto })
  async findAll(@Query() query: SignInRecordQueryDto) {
    return this.levelRecordService.findAll(query);
  }
}

