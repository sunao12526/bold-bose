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
exports.MpTagService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let MpTagService = class MpTagService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) { return this.prisma.mpTag.create({ data }); }
    async findAll(query) {
        const where = {};
        if (query?.accountId)
            where.accountId = Number(query.accountId);
        return this.prisma.mpTag.findMany({ where, orderBy: { id: 'desc' } });
    }
    async findOne(id) {
        const record = await this.prisma.mpTag.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('标签不存在');
        return record;
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.mpTag.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.mpTag.delete({ where: { id } });
    }
};
exports.MpTagService = MpTagService;
exports.MpTagService = MpTagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MpTagService);
//# sourceMappingURL=mp-tag.service.js.map