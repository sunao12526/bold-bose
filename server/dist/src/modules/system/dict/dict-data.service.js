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
exports.DictDataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let DictDataService = class DictDataService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.dictData.create({ data });
    }
    async findAll(query) {
        const where = {};
        if (query?.dictType) {
            where.dictType = query.dictType;
        }
        if (query?.status) {
            where.status = query.status;
        }
        return this.prisma.dictData.findMany({
            where,
            orderBy: [
                { sort: 'asc' },
                { id: 'asc' },
            ],
        });
    }
    async findOne(id) {
        const data = await this.prisma.dictData.findUnique({ where: { id } });
        if (!data)
            throw new common_1.NotFoundException('字典数据不存在');
        return data;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.dictData.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.dictData.delete({ where: { id } });
    }
};
exports.DictDataService = DictDataService;
exports.DictDataService = DictDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DictDataService);
//# sourceMappingURL=dict-data.service.js.map