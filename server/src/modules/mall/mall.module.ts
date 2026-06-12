import { Module } from '@nestjs/common';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { BrandController } from './brand/brand.controller';
import { BrandService } from './brand/brand.service';
import { PropertyController } from './property/property.controller';
import { PropertyService } from './property/property.service';
import { SpuController } from './spu/spu.controller';
import { SpuService } from './spu/spu.service';

@Module({
  controllers: [
    CategoryController,
    BrandController,
    PropertyController,
    SpuController,
  ],
  providers: [
    CategoryService,
    BrandService,
    PropertyService,
    SpuService,
  ],
  exports: [
    CategoryService,
    BrandService,
    PropertyService,
    SpuService,
  ],
})
export class MallModule {}
