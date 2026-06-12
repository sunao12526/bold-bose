import { Module } from '@nestjs/common';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { BrandController } from './brand/brand.controller';
import { BrandService } from './brand/brand.service';
import { PropertyController } from './property/property.controller';
import { PropertyService } from './property/property.service';
import { SpuController } from './spu/spu.controller';
import { SpuService } from './spu/spu.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { RefundController } from './refund/refund.controller';
import { RefundService } from './refund/refund.service';
import { PromotionController } from './promotion/promotion.controller';
import { PromotionService } from './promotion/promotion.service';
import { PayModule } from '../pay/pay.module';

@Module({
  imports: [PayModule],
  controllers: [
    CategoryController,
    BrandController,
    PropertyController,
    SpuController,
    OrderController,
    RefundController,
    PromotionController,
  ],
  providers: [
    CategoryService,
    BrandService,
    PropertyService,
    SpuService,
    OrderService,
    RefundService,
    PromotionService,
  ],
  exports: [
    CategoryService,
    BrandService,
    PropertyService,
    SpuService,
    OrderService,
    RefundService,
    PromotionService,
  ],
})
export class MallModule {}
