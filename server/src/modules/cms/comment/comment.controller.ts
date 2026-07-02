import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CommentQueryDto } from '../dto/comment-query.dto';
import { CommentResponseDto, CommentListResponseDto } from '../dto/comment-response.dto';

@ApiTags('CMS - 评论管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  @RequirePermissions('cms:comment:query')
  @ApiOperation({ summary: '分页查询文章评论列表' })
  @ApiOkResponse({ type: CommentListResponseDto })
  async findAll(@Query() query: CommentQueryDto) {
    return this.commentService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:comment:query')
  @ApiOperation({ summary: '根据 ID 获取评论详情' })
  @ApiOkResponse({ type: CommentResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id);
  }

  @Put(':id/approve')
  @RequirePermissions('cms:comment:update')
  @Log({ module: 'CMS评论', type: 'UPDATE', description: '审核通过评论' })
  @ApiOperation({ summary: '审核通过指定评论' })
  @ApiOkResponse({ type: CommentResponseDto })
  async approve(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.approve(id);
  }

  @Put(':id/reject')
  @RequirePermissions('cms:comment:update')
  @Log({ module: 'CMS评论', type: 'UPDATE', description: '拒绝评论' })
  @ApiOperation({ summary: '拒绝指定评论' })
  @ApiOkResponse({ type: CommentResponseDto })
  async reject(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.reject(id);
  }

  @Delete(':id')
  @RequirePermissions('cms:comment:delete')
  @Log({ module: 'CMS评论', type: 'DELETE', description: '删除评论' })
  @ApiOperation({ summary: '删除评论' })
  @ApiOkResponse({ type: CommentResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }
}

