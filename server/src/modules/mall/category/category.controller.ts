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
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CreateMallCategoryDto, UpdateMallCategoryDto } from '../dto/mall-input.dto';
import { MallCategoryResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 商品分类')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @RequirePermissions('mall:category:create')
  @Log({ module: '商品分类', type: 'CREATE', description: '创建分类' })
  @ApiOperation({ summary: '创建商品分类' })
  @ApiOkResponse({ type: MallCategoryResponseDto })
  async create(@Body() data: CreateMallCategoryDto) {
    return this.categoryService.create(data);
  }

  @Get()
  @RequirePermissions('mall:category:query')
  @ApiOperation({ summary: '查询所有商品分类列表' })
  @ApiOkResponse({ type: MallCategoryResponseDto, isArray: true })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @RequirePermissions('mall:category:query')
  @ApiOperation({ summary: '根据 ID 获取商品分类详情' })
  @ApiOkResponse({ type: MallCategoryResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:category:update')
  @Log({ module: '商品分类', type: 'UPDATE', description: '修改分类' })
  @ApiOperation({ summary: '更新商品分类信息' })
  @ApiOkResponse({ type: MallCategoryResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMallCategoryDto) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:category:delete')
  @Log({ module: '商品分类', type: 'DELETE', description: '删除分类' })
  @ApiOperation({ summary: '删除商品分类' })
  @ApiOkResponse({ type: MallCategoryResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}

