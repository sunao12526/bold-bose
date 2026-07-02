import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { GroupService } from './group.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreateGroupDto, UpdateGroupDto, MemberQueryDto } from './dto/member-input.dto';
import { MemberGroupResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 会员分组')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @RequirePermissions('member:group:query')
  @ApiOperation({ summary: '查询会员分组列表' })
  @ApiOkResponse({ type: MemberGroupResponseDto, isArray: true })
  async findAll(@Query() query: MemberQueryDto) {
    return this.groupService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('member:group:query')
  @ApiOperation({ summary: '根据 ID 获取会员分组详情' })
  @ApiOkResponse({ type: MemberGroupResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:group:create')
  @Log({ module: '会员分组', type: 'CREATE', description: '创建会员分组' })
  @ApiOperation({ summary: '创建会员分组' })
  @ApiOkResponse({ type: MemberGroupResponseDto })
  async create(@Body() data: CreateGroupDto) {
    return this.groupService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:group:update')
  @Log({ module: '会员分组', type: 'UPDATE', description: '更新会员分组' })
  @ApiOperation({ summary: '更新会员分组' })
  @ApiOkResponse({ type: MemberGroupResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateGroupDto) {
    return this.groupService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:group:delete')
  @Log({ module: '会员分组', type: 'DELETE', description: '删除会员分组' })
  @ApiOperation({ summary: '删除会员分组' })
  @ApiOkResponse({ type: MemberGroupResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.remove(id);
  }
}

