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
exports.DeptService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let DeptService = class DeptService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        if (data.parentId && data.parentId !== 0) {
            const parent = await this.prisma.dept.findUnique({ where: { id: data.parentId } });
            if (!parent)
                throw new common_1.NotFoundException('父级部门不存在');
        }
        return this.prisma.dept.create({
            data: {
                name: data.name,
                parentId: data.parentId || 0,
                sort: data.sort || 0,
                leaderId: data.leaderId || null,
                phone: data.phone || null,
                email: data.email || null,
                status: data.status || 'ENABLE',
            },
        });
    }
    async findAll(query) {
        const where = {};
        if (query?.name) {
            where.name = { contains: query.name };
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.dept.findMany({
            where,
            orderBy: { sort: 'asc' },
            include: {
                leader: {
                    select: {
                        id: true,
                        username: true,
                        nickname: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const record = await this.prisma.dept.findUnique({
            where: { id },
            include: {
                leader: {
                    select: {
                        id: true,
                        username: true,
                        nickname: true,
                    },
                },
            },
        });
        if (!record)
            throw new common_1.NotFoundException('部门不存在');
        return record;
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.parentId && data.parentId === id) {
            throw new Error('不能选择自己作为父级部门');
        }
        if (data.parentId && data.parentId !== 0) {
            const parent = await this.prisma.dept.findUnique({ where: { id: data.parentId } });
            if (!parent)
                throw new common_1.NotFoundException('父级部门不存在');
        }
        return this.prisma.dept.update({
            where: { id },
            data: {
                name: data.name,
                parentId: data.parentId !== undefined ? data.parentId : undefined,
                sort: data.sort !== undefined ? data.sort : undefined,
                leaderId: data.leaderId !== undefined ? data.leaderId : undefined,
                phone: data.phone !== undefined ? data.phone : undefined,
                email: data.email !== undefined ? data.email : undefined,
                status: data.status !== undefined ? data.status : undefined,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        const children = await this.prisma.dept.findFirst({ where: { parentId: id } });
        if (children) {
            throw new Error('该部门下还有子部门，无法删除');
        }
        const users = await this.prisma.user.findFirst({ where: { deptId: id } });
        if (users) {
            throw new Error('该部门下还有绑定员工，无法删除');
        }
        return this.prisma.dept.delete({ where: { id } });
    }
};
exports.DeptService = DeptService;
exports.DeptService = DeptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeptService);
//# sourceMappingURL=dept.service.js.map