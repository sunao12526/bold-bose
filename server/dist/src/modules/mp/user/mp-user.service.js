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
exports.MpUserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../shared/prisma/prisma.service");
let MpUserService = class MpUserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query?.accountId)
            where.accountId = Number(query.accountId);
        if (query?.keyword) {
            where.OR = [
                { nickname: { contains: query.keyword } },
                { openid: { contains: query.keyword } },
            ];
        }
        if (query?.subscribeStatus !== undefined)
            where.subscribeStatus = Number(query.subscribeStatus);
        return this.prisma.mpUser.findMany({ where, orderBy: { id: 'desc' } });
    }
    async findOne(id) {
        return this.prisma.mpUser.findUnique({ where: { id } });
    }
};
exports.MpUserService = MpUserService;
exports.MpUserService = MpUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MpUserService);
//# sourceMappingURL=mp-user.service.js.map