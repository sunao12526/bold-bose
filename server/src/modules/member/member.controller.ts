import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CommonStatus } from '@prisma/client';
import {
  MemberQueryDto,
  UpdateMemberStatusDto,
  AdjustAmountDto,
  AssignTagsDto,
  AssignLevelDto,
  AssignGroupDto,
} from './dto/member-input.dto';
import { MemberResponseDto, MemberListResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 会员管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/user')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  @RequirePermissions('member:user:query')
  @ApiOperation({ summary: '根据条件查询会员列表' })
  @ApiOkResponse({ type: MemberListResponseDto })
  async findAll(@Query() query: MemberQueryDto) {
    return this.memberService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('member:user:query')
  @ApiOperation({ summary: '根据 ID 获取会员详情' })
  @ApiOkResponse({ type: MemberResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.memberService.findOne(id);
  }

  @Put(':id/status')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '修改会员状态' })
  @ApiOperation({ summary: '修改会员状态' })
  @ApiOkResponse({ type: MemberResponseDto })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMemberStatusDto,
  ) {
    return this.memberService.updateStatus(id, body.status);
  }

  @Put(':id/adjust-points')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '调整会员积分' })
  @ApiOperation({ summary: '调整会员积分' })
  @ApiOkResponse({ type: MemberResponseDto })
  async adjustPoints(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AdjustAmountDto,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.adjustPoints(id, body.amount, operatorId);
  }

  @Put(':id/adjust-balance')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '调整会员余额' })
  @ApiOperation({ summary: '调整会员余额' })
  @ApiOkResponse({ type: MemberResponseDto })
  async adjustBalance(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AdjustAmountDto,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.adjustBalance(id, body.amount, operatorId);
  }

  @Put(':id/adjust-experience')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '调整会员成长值' })
  @ApiOperation({ summary: '调整会员成长值' })
  @ApiOkResponse({ type: MemberResponseDto })
  async adjustExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AdjustAmountDto,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.adjustExperience(id, body.amount, operatorId);
  }

  @Put(':id/assign-tags')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '分配会员标签' })
  @ApiOperation({ summary: '为会员分配标签' })
  @ApiOkResponse({ type: MemberResponseDto })
  async assignTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignTagsDto,
  ) {
    return this.memberService.assignTags(id, body.tagIds);
  }

  @Put(':id/update-level')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '手动调级' })
  @ApiOperation({ summary: '手动调级' })
  @ApiOkResponse({ type: MemberResponseDto })
  async updateLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignLevelDto,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.updateLevel(id, body.levelId ? Number(body.levelId) : null, operatorId);
  }

  @Put(':id/assign-group')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '分配会员分组' })
  @ApiOperation({ summary: '分配会员分组' })
  @ApiOkResponse({ type: MemberResponseDto })
  async assignGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignGroupDto,
  ) {
    return this.memberService.assignGroup(id, body.groupId ? Number(body.groupId) : null);
  }
}

