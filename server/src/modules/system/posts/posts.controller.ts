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
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { PostsQueryDto } from '../dto/posts-query.dto';
import { CreatePostsDto, UpdatePostsDto } from '../dto/posts-input.dto';
import { PostsResponseDto, PostsListResponseDto } from '../dto/posts-response.dto';

@ApiTags('系统 - 岗位管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Post()
  @RequirePermissions('system:posts:create')
  @Log({
    module: 'system_posts',
    type: 'CREATE',
    description: '创建system_posts',
  })
  @ApiOperation({ summary: '创建岗位' })
  @ApiOkResponse({ type: PostsResponseDto })
  async create(@Body() data: CreatePostsDto) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('system:posts:query')
  @ApiOperation({ summary: '分页查询岗位列表' })
  @ApiOkResponse({ type: PostsListResponseDto })
  async findAll(@Query() query: PostsQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:posts:query')
  @ApiOperation({ summary: '根据 ID 获取岗位详情' })
  @ApiOkResponse({ type: PostsResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:posts:update')
  @Log({
    module: 'system_posts',
    type: 'UPDATE',
    description: '修改system_posts',
  })
  @ApiOperation({ summary: '修改岗位' })
  @ApiOkResponse({ type: PostsResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostsDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:posts:delete')
  @Log({
    module: 'system_posts',
    type: 'DELETE',
    description: '删除system_posts',
  })
  @ApiOperation({ summary: '删除岗位' })
  @ApiOkResponse({ type: PostsResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

