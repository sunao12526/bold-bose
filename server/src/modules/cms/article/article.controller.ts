import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { ArticleQueryDto } from '../dto/article-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post()
  @RequirePermissions('cms:article:create')
  @Log({ module: 'CMS文章', type: 'CREATE', description: '创建文章' })
  async create(@Body() data: any) {
    return this.articleService.create(data);
  }

  @Get()
  @RequirePermissions('cms:article:query')
  async findAll(@Query() query: ArticleQueryDto) {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:article:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:article:update')
  @Log({ module: 'CMS文章', type: 'UPDATE', description: '修改文章' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.articleService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:article:delete')
  @Log({ module: 'CMS文章', type: 'DELETE', description: '删除文章' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.remove(id);
  }

  @Put(':id/status')
  @RequirePermissions('cms:article:update')
  @Log({ module: 'CMS文章', type: 'UPDATE', description: '修改文章状态' })
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.articleService.updateStatus(id, status);
  }
}
