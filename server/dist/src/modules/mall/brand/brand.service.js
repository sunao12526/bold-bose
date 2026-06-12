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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let BrandService = class BrandService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.mallBrand.create({ data });
    }
    async findAll() {
        return this.prisma.mallBrand.findMany({
            orderBy: { sort: 'asc' },
        });
    }
    async findOne(id) {
        const brand = await this.prisma.mallBrand.findUnique({
            where: { id },
        });
        if (!brand)
            throw new common_1.NotFoundException('商品品牌不存在');
        return brand;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.mallBrand.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const spuCount = await this.prisma.mallSpu.count({
            where: { brandId: id },
        });
        if (spuCount > 0) {
            throw new common_1.BadRequestException('该品牌下存在关联商品，无法直接删除');
        }
        return this.prisma.mallBrand.delete({
            where: { id },
        });
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BrandService);
//# sourceMappingURL=brand.service.js.map