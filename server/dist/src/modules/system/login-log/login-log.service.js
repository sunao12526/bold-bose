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
exports.LoginLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let LoginLogService = class LoginLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.loginLog.create({
            data: {
                username: data.username,
                ip: data.ip,
                userAgent: data.userAgent,
                status: data.status,
                message: data.message || null,
            },
        });
    }
    async findAll(query) {
        const where = {};
        if (query?.username) {
            where.username = { contains: query.username };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.loginLog.findMany({
            where,
            orderBy: { loginTime: 'desc' },
        });
    }
};
exports.LoginLogService = LoginLogService;
exports.LoginLogService = LoginLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoginLogService);
//# sourceMappingURL=login-log.service.js.map