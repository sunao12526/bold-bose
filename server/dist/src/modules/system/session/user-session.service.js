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
exports.UserSessionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let UserSessionService = class UserSessionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.username) {
            where.username = {
                contains: query.username,
                mode: 'insensitive',
            };
        }
        if (query.ip) {
            where.ip = {
                contains: query.ip,
                mode: 'insensitive',
            };
        }
        return this.prisma.userSession.findMany({
            where: {
                ...where,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                lastActiveTime: 'desc',
            },
        });
    }
    async kickout(id) {
        const session = await this.prisma.userSession.findUnique({
            where: { id },
        });
        if (!session) {
            throw new common_1.NotFoundException('该在线会话不存在或已过期');
        }
        return this.prisma.userSession.delete({
            where: { id },
        });
    }
};
exports.UserSessionService = UserSessionService;
exports.UserSessionService = UserSessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserSessionService);
//# sourceMappingURL=user-session.service.js.map