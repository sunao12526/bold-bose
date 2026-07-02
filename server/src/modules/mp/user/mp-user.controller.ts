import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MpUserService } from './mp-user.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { UserQueryDto } from '../dto/user-query.dto';
import { MpUserResponseDto, MpUserListResponseDto } from '../dto/mp-response.dto';

@ApiTags('微信公众号 - 粉丝用户')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/user')
export class MpUserController {
  constructor(private service: MpUserService) {}

  @Get()
  @RequirePermissions('mp:user:query')
  @ApiOperation({ summary: '分页查询公众号粉丝用户列表' })
  @ApiOkResponse({ type: MpUserListResponseDto })
  async findAll(@Query() query: UserQueryDto) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:user:query')
  @ApiOperation({ summary: '根据 ID 获取粉丝用户详情' })
  @ApiOkResponse({ type: MpUserResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Put(':id')
  @RequirePermissions('mp:user:update')
  @ApiOperation({ summary: '更新公众号粉丝信息 (备注或标签)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: { remark?: string; tagIds?: number[] }) {
    await this.service.updateUser(id, body);
    return { data: true };
  }

  @Post('sync')
  @RequirePermissions('mp:user:sync')
  @ApiOperation({ summary: '同步公众号粉丝用户' })
  async syncUser(@Query('accountId', ParseIntPipe) accountId: number) {
    await this.service.syncUser(accountId);
    return { data: true };
  }
}

