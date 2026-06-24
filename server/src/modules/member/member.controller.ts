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
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CommonStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/user')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  @RequirePermissions('member:user:query')
  async findAll(@Query() query: any) {
    return this.memberService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('member:user:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.memberService.findOne(id);
  }

  @Put(':id/status')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '修改会员状态' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: CommonStatus,
  ) {
    return this.memberService.updateStatus(id, status);
  }

  @Put(':id/adjust-points')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '调整会员积分' })
  async adjustPoints(
    @Param('id', ParseIntPipe) id: number,
    @Body('amount', ParseIntPipe) amount: number,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.adjustPoints(id, amount, operatorId);
  }

  @Put(':id/adjust-balance')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '调整会员余额' })
  async adjustBalance(
    @Param('id', ParseIntPipe) id: number,
    @Body('amount', ParseIntPipe) amount: number,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.adjustBalance(id, amount, operatorId);
  }

  @Put(':id/adjust-experience')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '调整会员成长值' })
  async adjustExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body('amount', ParseIntPipe) amount: number,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.adjustExperience(id, amount, operatorId);
  }

  @Put(':id/assign-tags')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '分配会员标签' })
  async assignTags(
    @Param('id', ParseIntPipe) id: number,
    @Body('tagIds') tagIds: number[],
  ) {
    return this.memberService.assignTags(id, tagIds);
  }

  @Put(':id/update-level')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '手动调级' })
  async updateLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body('levelId') levelId: number | null,
    @Req() req: any,
  ) {
    const operatorId = req.user?.username || 'system';
    return this.memberService.updateLevel(id, levelId ? Number(levelId) : null, operatorId);
  }

  @Put(':id/assign-group')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员管理', type: 'UPDATE', description: '分配会员分组' })
  async assignGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body('groupId') groupId: number | null,
  ) {
    return this.memberService.assignGroup(id, groupId ? Number(groupId) : null);
  }
}
