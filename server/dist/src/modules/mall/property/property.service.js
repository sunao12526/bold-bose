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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let PropertyService = class PropertyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { values, ...rest } = data;
        return this.prisma.mallProperty.create({
            data: {
                ...rest,
                values: values && values.length > 0
                    ? {
                        create: values.map((v) => ({ value: v })),
                    }
                    : undefined,
            },
            include: { values: true },
        });
    }
    async findAll() {
        return this.prisma.mallProperty.findMany({
            include: { values: true },
            orderBy: { id: 'asc' },
        });
    }
    async findOne(id) {
        const property = await this.prisma.mallProperty.findUnique({
            where: { id },
            include: { values: true },
        });
        if (!property)
            throw new common_1.NotFoundException('商品规格不存在');
        return property;
    }
    async update(id, data) {
        await this.findOne(id);
        const { values, ...rest } = data;
        await this.prisma.mallProperty.update({
            where: { id },
            data: rest,
        });
        if (values !== undefined) {
            const keepIds = values
                .map((v) => v.id)
                .filter((vid) => !!vid);
            await this.prisma.mallPropertyValue.deleteMany({
                where: {
                    propertyId: id,
                    id: { notIn: keepIds },
                },
            });
            for (const val of values) {
                if (val.id) {
                    await this.prisma.mallPropertyValue.update({
                        where: { id: val.id },
                        data: { value: val.value },
                    });
                }
                else {
                    await this.prisma.mallPropertyValue.create({
                        data: {
                            propertyId: id,
                            value: val.value,
                        },
                    });
                }
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.mallProperty.delete({
            where: { id },
        });
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyService);
//# sourceMappingURL=property.service.js.map