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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let CategoryService = class CategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        if (data.parentId) {
            const parent = await this.prisma.mallCategory.findUnique({
                where: { id: data.parentId },
            });
            if (!parent)
                throw new common_1.BadRequestException('父分类不存在');
        }
        return this.prisma.mallCategory.create({ data });
    }
    async findAll() {
        return this.prisma.mallCategory.findMany({
            orderBy: { sort: 'asc' },
        });
    }
    async findOne(id) {
        const category = await this.prisma.mallCategory.findUnique({
            where: { id },
        });
        if (!category)
            throw new common_1.NotFoundException('商品分类不存在');
        return category;
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.parentId) {
            if (data.parentId === id) {
                throw new common_1.BadRequestException('父分类不能是自己本身');
            }
            const parent = await this.prisma.mallCategory.findUnique({
                where: { id: data.parentId },
            });
            if (!parent)
                throw new common_1.BadRequestException('父分类不存在');
        }
        return this.prisma.mallCategory.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const childrenCount = await this.prisma.mallCategory.count({
            where: { parentId: id },
        });
        if (childrenCount > 0) {
            throw new common_1.BadRequestException('存在子分类，无法直接删除');
        }
        const spuCount = await this.prisma.mallSpu.count({
            where: { categoryId: id },
        });
        if (spuCount > 0) {
            throw new common_1.BadRequestException('该分类下存在关联商品，无法直接删除');
        }
        return this.prisma.mallCategory.delete({
            where: { id },
        });
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map