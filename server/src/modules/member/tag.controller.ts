import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreateMemberTagDto, UpdateMemberTagDto } from './dto/member-input.dto';
import { MemberTagResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 会员标签')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  @RequirePermissions('member:tag:query')
  @ApiOperation({ summary: '获取全部会员标签列表' })
  @ApiOkResponse({ type: MemberTagResponseDto, isArray: true })
  async findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @RequirePermissions('member:tag:query')
  @ApiOperation({ summary: '根据 ID 获取会员标签详情' })
  @ApiOkResponse({ type: MemberTagResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:tag:create')
  @Log({ module: '会员标签', type: 'CREATE', description: '创建会员标签' })
  @ApiOperation({ summary: '创建会员标签' })
  @ApiOkResponse({ type: MemberTagResponseDto })
  async create(@Body() data: CreateMemberTagDto) {
    return this.tagService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:tag:update')
  @Log({ module: '会员标签', type: 'UPDATE', description: '更新会员标签' })
  @ApiOperation({ summary: '更新会员标签' })
  @ApiOkResponse({ type: MemberTagResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMemberTagDto) {
    return this.tagService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:tag:delete')
  @Log({ module: '会员标签', type: 'DELETE', description: '删除会员标签' })
  @ApiOperation({ summary: '删除会员标签' })
  @ApiOkResponse({ type: MemberTagResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}

