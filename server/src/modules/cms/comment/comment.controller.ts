import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  @RequirePermissions('cms:comment:query')
  async findAll(@Query() query: any) {
    return this.commentService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:comment:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id);
  }

  @Put(':id/approve')
  @RequirePermissions('cms:comment:update')
  @Log({ module: 'CMS评论', type: 'UPDATE', description: '审核通过评论' })
  async approve(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.approve(id);
  }

  @Put(':id/reject')
  @RequirePermissions('cms:comment:update')
  @Log({ module: 'CMS评论', type: 'UPDATE', description: '拒绝评论' })
  async reject(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.reject(id);
  }

  @Delete(':id')
  @RequirePermissions('cms:comment:delete')
  @Log({ module: 'CMS评论', type: 'DELETE', description: '删除评论' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}
