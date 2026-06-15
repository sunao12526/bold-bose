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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @RequirePermissions('mall:category:create')
  @Log({ module: '商品分类', type: 'CREATE', description: '创建分类' })
  async create(@Body() data: any) {
    return this.categoryService.create(data);
  }

  @Get()
  @RequirePermissions('mall:category:query')
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @RequirePermissions('mall:category:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:category:update')
  @Log({ module: '商品分类', type: 'UPDATE', description: '修改分类' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:category:delete')
  @Log({ module: '商品分类', type: 'DELETE', description: '删除分类' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
