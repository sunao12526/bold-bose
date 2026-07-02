import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CategoryQueryDto } from '../dto/category-query.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category-input.dto';
import { CategoryResponseDto, CategoryListResponseDto } from '../dto/category-response.dto';

@ApiTags('CMS - 栏目分类管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cms/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @RequirePermissions('cms:category:create')
  @Log({ module: 'CMS分类', type: 'CREATE', description: '创建分类' })
  @ApiOperation({ summary: '创建分类' })
  @ApiOkResponse({ type: CategoryResponseDto })
  async create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }

  @Get()
  @RequirePermissions('cms:category:query')
  @ApiOperation({ summary: '分页查询分类列表' })
  @ApiOkResponse({ type: CategoryListResponseDto })
  async findAll(@Query() query: CategoryQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('cms:category:query')
  @ApiOperation({ summary: '根据 ID 获取分类详情' })
  @ApiOkResponse({ type: CategoryResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('cms:category:update')
  @Log({ module: 'CMS分类', type: 'UPDATE', description: '修改分类' })
  @ApiOperation({ summary: '修改分类' })
  @ApiOkResponse({ type: CategoryResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCategoryDto) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('cms:category:delete')
  @Log({ module: 'CMS分类', type: 'DELETE', description: '删除分类' })
  @ApiOperation({ summary: '删除分类' })
  @ApiOkResponse({ type: CategoryResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}

