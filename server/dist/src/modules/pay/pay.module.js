"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../shared/prisma/prisma.module");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const channel_service_1 = require("./channel.service");
const channel_controller_1 = require("./channel.controller");
const pay_order_service_1 = require("./pay-order.service");
const pay_order_controller_1 = require("./pay-order.controller");
const pay_refund_service_1 = require("./pay-refund.service");
const pay_refund_controller_1 = require("./pay-refund.controller");
const notify_service_1 = require("./notify.service");
let PayModule = class PayModule {
};
exports.PayModule = PayModule;
exports.PayModule = PayModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [
            app_controller_1.PayAppController,
            channel_controller_1.PayChannelController,
            pay_order_controller_1.PayOrderController,
            pay_refund_controller_1.PayRefundController,
        ],
        providers: [
            app_service_1.PayAppService,
            channel_service_1.PayChannelService,
            pay_order_service_1.PayOrderService,
            pay_refund_service_1.PayRefundService,
            notify_service_1.NotifyService,
        ],
        exports: [
            pay_order_service_1.PayOrderService,
            pay_refund_service_1.PayRefundService,
            notify_service_1.NotifyService,
        ],
    })
], PayModule);
//# sourceMappingURL=pay.module.js.map