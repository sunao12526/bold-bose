"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const user_cache_service_1 = require("../../shared/user-cache.service");
const pagination_1 = require("../../shared/pagination");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    prisma;
    userCache;
    constructor(prisma, userCache) {
        this.prisma = prisma;
        this.userCache = userCache;
    }
    async create(data) {
        const existing = await this.prisma.user.findUnique({
            where: { username: data.username },
        });
        if (existing) {
            throw new common_1.BadRequestException('用户名已存在');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const { roleIds, postIds, ...rest } = data;
        const user = await this.prisma.user.create({
            data: {
                ...rest,
                password: hashedPassword,
            },
        });
        if (roleIds && roleIds.length > 0) {
            await this.assignRoles(user.id, roleIds);
        }
        if (postIds && postIds.length > 0) {
            await this.assignPosts(user.id, postIds);
        }
        return user;
    }
    async findAll(query) {
        const where = {};
        if (query?.username) {
            where.username = { contains: query.username };
        }
        if (query?.nickname) {
            where.nickname = { contains: query.nickname };
        }
        if (query?.mobile) {
            where.mobile = { contains: query.mobile };
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.deptId) {
            where.deptId = Number(query.deptId);
        }
        return (0, pagination_1.paginateQuery)(this.prisma, 'user', query || {}, {
            where,
            select: {
                id: true,
                username: true,
                nickname: true,
                email: true,
                mobile: true,
                status: true,
                remark: true,
                deptId: true,
                createdAt: true,
                updatedAt: true,
                roles: { include: { role: true } },
                posts: { include: { post: true } },
                dept: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: { select: { roleId: true } },
                posts: { select: { postId: true } },
            },
        });
    }
    async update(id, data) {
        const { roleIds, postIds, password, ...rest } = data;
        const updateData = { ...rest };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        if (roleIds !== undefined) {
            await this.assignRoles(id, roleIds);
        }
        if (postIds !== undefined) {
            await this.assignPosts(id, postIds);
        }
        return user;
    }
    async remove(id) {
        if (id === 1) {
            throw new common_1.BadRequestException('系统内置超级管理员，无法删除');
        }
        const result = await this.prisma.user.delete({ where: { id } });
        this.userCache.invalidateUser(id);
        return result;
    }
    async assignRoles(userId, roleIds) {
        await this.prisma.userRole.deleteMany({ where: { userId } });
        if (roleIds.length > 0) {
            const mappings = roleIds.map((roleId) => ({ userId, roleId }));
            await this.prisma.userRole.createMany({ data: mappings });
        }
        this.userCache.invalidateUser(userId);
        return { success: true };
    }
    async assignPosts(userId, postIds) {
        await this.prisma.userPost.deleteMany({ where: { userId } });
        if (postIds.length > 0) {
            const mappings = postIds.map((postId) => ({ userId, postId }));
            await this.prisma.userPost.createMany({ data: mappings });
        }
        return { success: true };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
                email: true,
                mobile: true,
                remark: true,
                status: true,
                createdAt: true,
            },
        });
        if (!user)
            throw new common_1.BadRequestException('用户不存在');
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            include: { role: true },
        });
        const roles = userRoles.map((ur) => ({
            id: ur.role.id,
            name: ur.role.name,
            code: ur.role.code,
        }));
        return {
            user,
            roles,
        };
    }
    async updateProfile(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                nickname: data.nickname,
                email: data.email,
                mobile: data.mobile,
                avatar: data.avatar,
            },
            select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
                email: true,
                mobile: true,
            }
        });
    }
    async updatePassword(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.BadRequestException('用户不存在');
        const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('原密码错误，请重新输入');
        }
        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return { success: true };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_cache_service_1.UserCacheService])
], UserService);
//# sourceMappingURL=user.service.js.map