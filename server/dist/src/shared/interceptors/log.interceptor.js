"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
const log_decorator_1 = require("../decorators/log.decorator");
let LogInterceptor = class LogInterceptor {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    intercept(context, next) {
        const startTime = Date.now();
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const logOptions = this.reflector.getAllAndOverride(log_decorator_1.LOG_METADATA_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        return next.handle().pipe((0, operators_1.tap)(() => {
            if (logOptions) {
                const duration = Date.now() - startTime;
                this.saveLog(request, logOptions, 200, duration);
            }
        }), (0, operators_1.catchError)((err) => {
            if (logOptions) {
                const duration = Date.now() - startTime;
                const status = err.status || 500;
                this.saveLog(request, logOptions, status, duration);
            }
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
    async saveLog(request, options, status, duration) {
        try {
            const user = request.user;
            let ip = request.ip || request.headers['x-forwarded-for'] || '';
            if (Array.isArray(ip)) {
                ip = ip[0];
            }
            if (!ip && request.socket) {
                ip = request.socket.remoteAddress;
            }
            await this.prisma.operationLog.create({
                data: {
                    userId: user?.id || null,
                    username: user?.username || null,
                    module: options.module,
                    type: options.type,
                    description: options.description,
                    path: request.url,
                    method: request.method,
                    ip: typeof ip === 'string' ? ip.substring(0, 50) : '',
                    status,
                    duration,
                },
            });
        }
        catch (e) {
            console.error('Failed to save operation log:', e);
        }
    }
};
exports.LogInterceptor = LogInterceptor;
exports.LogInterceptor = LogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], LogInterceptor);
//# sourceMappingURL=log.interceptor.js.map