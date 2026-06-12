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
exports.DictTypeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let DictTypeService = class DictTypeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.dictType.findUnique({ where: { type: data.type } });
        if (existing)
            throw new common_1.BadRequestException('字典类型已存在');
        return this.prisma.dictType.create({ data });
    }
    async findAll() {
        return this.prisma.dictType.findMany({ orderBy: { id: 'asc' } });
    }
    async findOne(id) {
        return this.prisma.dictType.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.prisma.dictType.update({ where: { id }, data });
    }
    async remove(id) {
        const type = await this.prisma.dictType.findUnique({ where: { id } });
        if (!type)
            throw new common_1.BadRequestException('字典类型不存在');
        const count = await this.prisma.dictData.count({ where: { dictType: type.type } });
        if (count > 0)
            throw new common_1.BadRequestException('该字典类型包含数据，无法删除');
        return this.prisma.dictType.delete({ where: { id } });
    }
};
exports.DictTypeService = DictTypeService;
exports.DictTypeService = DictTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DictTypeService);
//# sourceMappingURL=dict-type.service.js.map