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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const user_cache_service_1 = require("../../shared/user-cache.service");
const pagination_1 = require("../../shared/pagination");
let RoleService = class RoleService {
    prisma;
    userCache;
    constructor(prisma, userCache) {
        this.prisma = prisma;
        this.userCache = userCache;
    }
    async create(data) {
        return this.prisma.role.create({ data });
    }
    async findAll(query) {
        const where = {};
        if (query?.name) {
            where.name = { contains: query.name };
        }
        if (query?.code) {
            where.code = { contains: query.code };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return (0, pagination_1.paginateQuery)(this.prisma, 'role', query || {}, {
            where,
            orderBy: { sort: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.role.findUnique({
            where: { id },
            include: { menus: { select: { menuId: true } } },
        });
    }
    async update(id, data) {
        const result = await this.prisma.role.update({ where: { id }, data });
        this.userCache.invalidateAll();
        return result;
    }
    async remove(id) {
        const userCount = await this.prisma.userRole.count({ where: { roleId: id } });
        if (userCount > 0) {
            throw new Error('该角色下还有用户，无法删除');
        }
        return this.prisma.role.delete({ where: { id } });
    }
    async assignMenus(roleId, menuIds) {
        await this.prisma.roleMenu.deleteMany({ where: { roleId } });
        if (menuIds.length > 0) {
            const mappings = menuIds.map((menuId) => ({ roleId, menuId }));
            await this.prisma.roleMenu.createMany({ data: mappings });
        }
        this.userCache.invalidateAll();
        return { success: true };
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_cache_service_1.UserCacheService])
], RoleService);
//# sourceMappingURL=role.service.js.map