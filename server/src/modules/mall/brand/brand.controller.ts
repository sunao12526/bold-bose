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
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { BrandQueryDto } from './dto/brand-query.dto';
import { CreateMallBrandDto, UpdateMallBrandDto } from '../dto/mall-input.dto';
import { MallBrandResponseDto, MallBrandListResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 商品品牌')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Post()
  @RequirePermissions('mall:brand:create')
  @Log({ module: '商品品牌', type: 'CREATE', description: '创建品牌' })
  @ApiOperation({ summary: '创建商品品牌' })
  @ApiOkResponse({ type: MallBrandResponseDto })
  async create(@Body() data: CreateMallBrandDto) {
    return this.brandService.create(data);
  }

  @Get()
  @RequirePermissions('mall:brand:query')
  @ApiOperation({ summary: '根据条件分页查询品牌列表' })
  @ApiOkResponse({ type: MallBrandListResponseDto })
  async findAll(@Query() query: BrandQueryDto) {
    return this.brandService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('mall:brand:query')
  @ApiOperation({ summary: '根据 ID 获取品牌详情' })
  @ApiOkResponse({ type: MallBrandResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:brand:update')
  @Log({ module: '商品品牌', type: 'UPDATE', description: '修改品牌' })
  @ApiOperation({ summary: '更新商品品牌信息' })
  @ApiOkResponse({ type: MallBrandResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMallBrandDto) {
    return this.brandService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:brand:delete')
  @Log({ module: '商品品牌', type: 'DELETE', description: '删除品牌' })
  @ApiOperation({ summary: '删除商品品牌' })
  @ApiOkResponse({ type: MallBrandResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}

