"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MallModule = void 0;
const common_1 = require("@nestjs/common");
const category_controller_1 = require("./category/category.controller");
const category_service_1 = require("./category/category.service");
const brand_controller_1 = require("./brand/brand.controller");
const brand_service_1 = require("./brand/brand.service");
const property_controller_1 = require("./property/property.controller");
const property_service_1 = require("./property/property.service");
const spu_controller_1 = require("./spu/spu.controller");
const spu_service_1 = require("./spu/spu.service");
const order_controller_1 = require("./order/order.controller");
const order_service_1 = require("./order/order.service");
const refund_controller_1 = require("./refund/refund.controller");
const refund_service_1 = require("./refund/refund.service");
const promotion_controller_1 = require("./promotion/promotion.controller");
const promotion_service_1 = require("./promotion/promotion.service");
const pay_module_1 = require("../pay/pay.module");
let MallModule = class MallModule {
};
exports.MallModule = MallModule;
exports.MallModule = MallModule = __decorate([
    (0, common_1.Module)({
        imports: [pay_module_1.PayModule],
        controllers: [
            category_controller_1.CategoryController,
            brand_controller_1.BrandController,
            property_controller_1.PropertyController,
            spu_controller_1.SpuController,
            order_controller_1.OrderController,
            refund_controller_1.RefundController,
            promotion_controller_1.PromotionController,
        ],
        providers: [
            category_service_1.CategoryService,
            brand_service_1.BrandService,
            property_service_1.PropertyService,
            spu_service_1.SpuService,
            order_service_1.OrderService,
            refund_service_1.RefundService,
            promotion_service_1.PromotionService,
        ],
        exports: [
            category_service_1.CategoryService,
            brand_service_1.BrandService,
            property_service_1.PropertyService,
            spu_service_1.SpuService,
            order_service_1.OrderService,
            refund_service_1.RefundService,
            promotion_service_1.PromotionService,
        ],
    })
], MallModule);
//# sourceMappingURL=mall.module.js.map