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
exports.LevelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
const member_service_1 = require("./member.service");
let LevelService = class LevelService {
    prisma;
    memberService;
    constructor(prisma, memberService) {
        this.prisma = prisma;
        this.memberService = memberService;
    }
    async create(data) {
        const existing = await this.prisma.memberLevel.findUnique({
            where: { level: Number(data.level) },
        });
        if (existing) {
            throw new common_1.BadRequestException(`等级值 [${data.level}] 已存在`);
        }
        const level = await this.prisma.memberLevel.create({
            data: {
                name: data.name,
                level: Number(data.level),
                experience: Number(data.experience),
                discountPercent: Number(data.discountPercent || 100),
                status: data.status || client_1.CommonStatus.ENABLE,
            },
        });
        await this.recalculateAllUsersLevels();
        return level;
    }
    async findAll() {
        return this.prisma.memberLevel.findMany({
            orderBy: { level: 'asc' },
        });
    }
    async findOne(id) {
        const level = await this.prisma.memberLevel.findUnique({
            where: { id },
        });
        if (!level)
            throw new common_1.NotFoundException('会员等级不存在');
        return level;
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.level !== undefined) {
            const existing = await this.prisma.memberLevel.findFirst({
                where: {
                    level: Number(data.level),
                    id: { not: id },
                },
            });
            if (existing) {
                throw new common_1.BadRequestException(`等级值 [${data.level}] 已存在`);
            }
        }
        const level = await this.prisma.memberLevel.update({
            where: { id },
            data: {
                name: data.name,
                level: data.level !== undefined ? Number(data.level) : undefined,
                experience: data.experience !== undefined ? Number(data.experience) : undefined,
                discountPercent: data.discountPercent !== undefined ? Number(data.discountPercent) : undefined,
                status: data.status,
            },
        });
        await this.recalculateAllUsersLevels();
        return level;
    }
    async remove(id) {
        await this.findOne(id);
        const result = await this.prisma.memberLevel.delete({
            where: { id },
        });
        await this.recalculateAllUsersLevels();
        return result;
    }
    async recalculateAllUsersLevels() {
        const members = await this.prisma.memberUser.findMany();
        for (const member of members) {
            await this.memberService.updateMemberLevel(member.id);
        }
    }
};
exports.LevelService = LevelService;
exports.LevelService = LevelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        member_service_1.MemberService])
], LevelService);
//# sourceMappingURL=level.service.js.map