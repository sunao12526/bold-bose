import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  @RequirePermissions('member:tag:query')
  async findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  @RequirePermissions('member:tag:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:tag:create')
  @Log({ module: '会员标签', type: 'CREATE', description: '创建会员标签' })
  async create(@Body() data: any) {
    return this.tagService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:tag:update')
  @Log({ module: '会员标签', type: 'UPDATE', description: '更新会员标签' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.tagService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:tag:delete')
  @Log({ module: '会员标签', type: 'DELETE', description: '删除会员标签' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
