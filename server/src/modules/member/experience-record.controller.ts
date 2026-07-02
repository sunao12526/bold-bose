import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExperienceRecordService } from './experience-record.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { SignInRecordQueryDto } from './dto/member-input.dto';
import { MemberExperienceRecordListResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 成长值变动记录')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/experience-record')
export class ExperienceRecordController {
  constructor(private experienceRecordService: ExperienceRecordService) {}

  @Get()
  @RequirePermissions('member:user:query')
  @ApiOperation({ summary: '分页查询成长值变动记录列表' })
  @ApiOkResponse({ type: MemberExperienceRecordListResponseDto })
  async findAll(@Query() query: SignInRecordQueryDto) {
    return this.experienceRecordService.findAll(query);
  }
}

