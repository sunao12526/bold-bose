"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./shared/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const system_module_1 = require("./modules/system/system.module");
const infra_module_1 = require("./modules/infra/infra.module");
const mall_module_1 = require("./modules/mall/mall.module");
const member_module_1 = require("./modules/member/member.module");
const cms_module_1 = require("./modules/cms/cms.module");
const mp_module_1 = require("./modules/mp/mp.module");
const jwt_auth_guard_1 = require("./shared/guards/jwt-auth.guard");
const log_interceptor_1 = require("./shared/interceptors/log.interceptor");
const user_cache_module_1 = require("./shared/user-cache.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 60,
                }]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            user_cache_module_1.UserCacheModule,
            auth_module_1.AuthModule,
            system_module_1.SystemModule,
            infra_module_1.InfraModule,
            mall_module_1.MallModule,
            member_module_1.MemberModule,
            cms_module_1.CmsModule,
            mp_module_1.MpModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: log_interceptor_1.LogInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map