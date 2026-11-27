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
import { DeliveryService } from './delivery/delivery.service';
import {
  DeliveryExpressController,
  DeliveryTemplateController,
} from './delivery/delivery.controller';
import { InteractionService } from './interaction/interaction.service';
import { ProductCommentController } from './interaction/comment.controller';
import { AppProductInteractionController } from './interaction/app-interaction.controller';
import { CartService } from './trade/cart.service';
import { AppCartController } from './trade/app-cart.controller';
import { AppTradeOrderService } from './trade/app-trade-order.service';
import { AppTradeOrderController } from './trade/app-trade-order.controller';
import { MallStatisticsService } from './statistics/mall-statistics.service';
import { MallStatisticsController } from './statistics/mall-statistics.controller';
import { PayModule } from '../pay/pay.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [PayModule, MemberModule],
  controllers: [
    CategoryController,
    BrandController,
    PropertyController,
    SpuController,
    OrderController,
    RefundController,
    PromotionController,
    DeliveryExpressController,
    DeliveryTemplateController,
    ProductCommentController,
    AppProductInteractionController,
    AppCartController,
    AppTradeOrderController,
    MallStatisticsController,
  ],
  providers: [
    CategoryService,
    BrandService,
    PropertyService,
    SpuService,
    OrderService,
    RefundService,
    PromotionService,
    DeliveryService,
    InteractionService,
    CartService,
    AppTradeOrderService,
    MallStatisticsService,
  ],
  exports: [
    CategoryService,
    BrandService,
    PropertyService,
    SpuService,
    OrderService,
    RefundService,
    PromotionService,
    DeliveryService,
    InteractionService,
    CartService,
    AppTradeOrderService,
    MallStatisticsService,
  ],
})
export class MallModule {}
