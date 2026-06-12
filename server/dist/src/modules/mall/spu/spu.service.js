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
exports.SpuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let SpuService = class SpuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { skus, ...spuData } = data;
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let totalStock = 0;
        if (skus && skus.length > 0) {
            for (const sku of skus) {
                minPrice = Math.min(minPrice, sku.price || 0);
                maxPrice = Math.max(maxPrice, sku.price || 0);
                totalStock += sku.stock || 0;
            }
        }
        else {
            minPrice = 0;
            maxPrice = 0;
        }
        return this.prisma.$transaction(async (tx) => {
            return tx.mallSpu.create({
                data: {
                    ...spuData,
                    minPrice,
                    maxPrice,
                    totalStock,
                    skus: skus && skus.length > 0 ? {
                        create: skus.map((sku) => ({
                            properties: sku.properties || [],
                            price: sku.price || 0,
                            marketPrice: sku.marketPrice || null,
                            costPrice: sku.costPrice || null,
                            stock: sku.stock || 0,
                            picUrl: sku.picUrl || null,
                            barCode: sku.barCode || null,
                        })),
                    } : undefined,
                },
                include: { skus: true },
            });
        });
    }
    async findAll() {
        return this.prisma.mallSpu.findMany({
            include: {
                skus: true,
                category: { select: { id: true, name: true } },
                brand: { select: { id: true, name: true } },
            },
            orderBy: { sort: 'asc' },
        });
    }
    async findOne(id) {
        const spu = await this.prisma.mallSpu.findUnique({
            where: { id },
            include: { skus: true },
        });
        if (!spu)
            throw new common_1.NotFoundException('商品不存在');
        return spu;
    }
    async update(id, data) {
        await this.findOne(id);
        const { skus, ...spuData } = data;
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let totalStock = 0;
        if (skus && skus.length > 0) {
            for (const sku of skus) {
                minPrice = Math.min(minPrice, sku.price || 0);
                maxPrice = Math.max(maxPrice, sku.price || 0);
                totalStock += sku.stock || 0;
            }
        }
        else {
            minPrice = 0;
            maxPrice = 0;
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.mallSku.deleteMany({
                where: { spuId: id },
            });
            return tx.mallSpu.update({
                where: { id },
                data: {
                    ...spuData,
                    minPrice,
                    maxPrice,
                    totalStock,
                    skus: skus && skus.length > 0 ? {
                        create: skus.map((sku) => ({
                            properties: sku.properties || [],
                            price: sku.price || 0,
                            marketPrice: sku.marketPrice || null,
                            costPrice: sku.costPrice || null,
                            stock: sku.stock || 0,
                            picUrl: sku.picUrl || null,
                            barCode: sku.barCode || null,
                        })),
                    } : undefined,
                },
                include: { skus: true },
            });
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.mallSpu.delete({
            where: { id },
        });
    }
};
exports.SpuService = SpuService;
exports.SpuService = SpuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpuService);
//# sourceMappingURL=spu.service.js.map