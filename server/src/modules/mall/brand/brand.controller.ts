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
import { BrandService } from './brand.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { BrandQueryDto } from './dto/brand-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Post()
  @RequirePermissions('mall:brand:create')
  @Log({ module: '商品品牌', type: 'CREATE', description: '创建品牌' })
  async create(@Body() data: any) {
    return this.brandService.create(data);
  }

  @Get()
  @RequirePermissions('mall:brand:query')
  async findAll(@Query() query: BrandQueryDto) {
    return this.brandService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('mall:brand:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:brand:update')
  @Log({ module: '商品品牌', type: 'UPDATE', description: '修改品牌' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.brandService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:brand:delete')
  @Log({ module: '商品品牌', type: 'DELETE', description: '删除品牌' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
