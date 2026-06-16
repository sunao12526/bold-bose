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
var UserCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCacheService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
let UserCacheService = UserCacheService_1 = class UserCacheService {
    prisma;
    logger = new common_1.Logger(UserCacheService_1.name);
    cache = new Map();
    TTL = 5 * 60 * 1000;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserAuth(userId) {
        this.cleanup();
        const cached = this.cache.get(userId);
        if (cached && Date.now() < cached.expiresAt) {
            return cached;
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            include: { role: true },
        });
        const roleCodes = userRoles.map((ur) => ur.role.code);
        const isSuperAdmin = roleCodes.includes('super_admin');
        let permissions = [];
        if (!isSuperAdmin) {
            const roleIds = userRoles.map((ur) => ur.roleId);
            if (roleIds.length > 0) {
                const roleMenus = await this.prisma.roleMenu.findMany({
                    where: { roleId: { in: roleIds } },
                    include: { menu: true },
                });
                permissions = roleMenus
                    .map((rm) => rm.menu.permission)
                    .filter((p) => !!p);
            }
        }
        const auth = {
            roleCodes,
            permissions,
            isSuperAdmin,
            expiresAt: Date.now() + this.TTL,
        };
        this.cache.set(userId, auth);
        return auth;
    }
    invalidateUser(userId) {
        this.cache.delete(userId);
    }
    invalidateAll() {
        this.cache.clear();
    }
    cleanup() {
        const now = Date.now();
        for (const [userId, entry] of this.cache) {
            if (now > entry.expiresAt) {
                this.cache.delete(userId);
            }
        }
    }
};
exports.UserCacheService = UserCacheService;
exports.UserCacheService = UserCacheService = UserCacheService_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserCacheService);
//# sourceMappingURL=user-cache.service.js.map