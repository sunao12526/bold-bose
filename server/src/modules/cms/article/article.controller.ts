import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { ArticleQueryDto } from '../dto/article-query.dto';
import { CreateArticleDto, UpdateArticleDto, UpdateArticleStatusDto } from '../dto/article-input.dto';
import { ArticleResponseDto, ArticleListResponseDto } from '../dto/article-response.dto';

@ApiTags('CMS - 文章管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  @RequirePermissions('cms:article:create')
  @Log({ module: 'CMS文章', type: 'CREATE', description: '创建文章' })
  @ApiOperation({ summary: '创建文章' })
  @ApiOkResponse({ type: ArticleResponseDto })
  async create(@Body() data: CreateArticleDto) {
    return this.articleService.create(data);
  }

  @Get()
  @RequirePermissions('cms:article:query')
  @ApiOperation({ summary: '分页查询文章列表' })
  @ApiOkResponse({ type: ArticleListResponseDto })
  async findAll(@Query() query: ArticleQueryDto) {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:article:query')
  @ApiOperation({ summary: '根据 ID 获取文章详情' })
  @ApiOkResponse({ type: ArticleResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:article:update')
  @Log({ module: 'CMS文章', type: 'UPDATE', description: '修改文章' })
  @ApiOperation({ summary: '修改文章内容和元数据' })
  @ApiOkResponse({ type: ArticleResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateArticleDto) {
    return this.articleService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:article:delete')
  @Log({ module: 'CMS文章', type: 'DELETE', description: '删除文章' })
  @ApiOperation({ summary: '删除文章' })
  @ApiOkResponse({ type: ArticleResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.remove(id);
  }

  @Put(':id/status')
  @RequirePermissions('cms:article:update')
  @Log({ module: 'CMS文章', type: 'UPDATE', description: '修改文章状态' })
  @ApiOperation({ summary: '修改文章发布状态' })
  @ApiOkResponse({ type: ArticleResponseDto })
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateArticleStatusDto) {
    return this.articleService.updateStatus(id, body.status);
  }
}

