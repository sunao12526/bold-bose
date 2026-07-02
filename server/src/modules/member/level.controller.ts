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
import { LevelService } from './level.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreateLevelDto, UpdateLevelDto } from './dto/member-input.dto';
import { MemberLevelResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 会员等级')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/level')
export class LevelController {
  constructor(private levelService: LevelService) {}

  @Get()
  @RequirePermissions('member:level:query')
  @ApiOperation({ summary: '获取全部会员等级列表' })
  @ApiOkResponse({ type: MemberLevelResponseDto, isArray: true })
  async findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  @RequirePermissions('member:level:query')
  @ApiOperation({ summary: '根据 ID 获取会员等级详情' })
  @ApiOkResponse({ type: MemberLevelResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:level:create')
  @Log({ module: '会员等级', type: 'CREATE', description: '创建会员等级' })
  @ApiOperation({ summary: '创建会员等级' })
  @ApiOkResponse({ type: MemberLevelResponseDto })
  async create(@Body() data: CreateLevelDto) {
    return this.levelService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:level:update')
  @Log({ module: '会员等级', type: 'UPDATE', description: '更新会员等级' })
  @ApiOperation({ summary: '更新会员等级' })
  @ApiOkResponse({ type: MemberLevelResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateLevelDto) {
    return this.levelService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:level:delete')
  @Log({ module: '会员等级', type: 'DELETE', description: '删除会员等级' })
  @ApiOperation({ summary: '删除会员等级' })
  @ApiOkResponse({ type: MemberLevelResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.remove(id);
  }
}

