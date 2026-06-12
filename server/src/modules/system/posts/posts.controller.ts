import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Post()
  @RequirePermissions('system:posts:create')
  @Log({ module: 'system_posts', type: 'CREATE', description: '创建system_posts' })
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  @RequirePermissions('system:posts:query')
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:posts:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:posts:update')
  @Log({ module: 'system_posts', type: 'UPDATE', description: '修改system_posts' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:posts:delete')
  @Log({ module: 'system_posts', type: 'DELETE', description: '删除system_posts' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
