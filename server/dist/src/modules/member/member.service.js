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
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let MemberService = class MemberService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.memberUser.findMany({
            include: {
                level: true,
            },
            orderBy: { id: 'desc' },
        });
    }
    async findOne(id) {
        const member = await this.prisma.memberUser.findUnique({
            where: { id },
            include: {
                level: true,
            },
        });
        if (!member)
            throw new common_1.NotFoundException('会员不存在');
        return member;
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.memberUser.update({
            where: { id },
            data: { status },
            include: { level: true },
        });
    }
    async adjustPoints(id, amount) {
        const member = await this.findOne(id);
        const newPoints = member.points + amount;
        if (newPoints < 0) {
            throw new common_1.BadRequestException('调整后的积分不能小于 0');
        }
        return this.prisma.memberUser.update({
            where: { id },
            data: { points: newPoints },
            include: { level: true },
        });
    }
    async adjustBalance(id, amountCents) {
        const member = await this.findOne(id);
        const newBalance = member.balance + amountCents;
        if (newBalance < 0) {
            throw new common_1.BadRequestException('调整后的余额不能小于 0');
        }
        return this.prisma.memberUser.update({
            where: { id },
            data: { balance: newBalance },
            include: { level: true },
        });
    }
    async adjustExperience(id, amount) {
        const member = await this.findOne(id);
        const newExperience = member.experience + amount;
        if (newExperience < 0) {
            throw new common_1.BadRequestException('调整后的成长值不能小于 0');
        }
        await this.prisma.memberUser.update({
            where: { id },
            data: { experience: newExperience },
        });
        await this.updateMemberLevel(id);
        return this.findOne(id);
    }
    async assignTags(id, tagIds) {
        await this.findOne(id);
        return this.prisma.memberUser.update({
            where: { id },
            data: {
                tagIds: tagIds || null,
            },
            include: { level: true },
        });
    }
    async updateMemberLevel(memberId) {
        const member = await this.prisma.memberUser.findUnique({
            where: { id: memberId },
        });
        if (!member)
            return;
        const levels = await this.prisma.memberLevel.findMany({
            where: { status: client_1.CommonStatus.ENABLE },
            orderBy: { experience: 'desc' },
        });
        const matchedLevel = levels.find((l) => member.experience >= l.experience);
        const targetLevelId = matchedLevel ? matchedLevel.id : null;
        if (member.levelId !== targetLevelId) {
            await this.prisma.memberUser.update({
                where: { id: memberId },
                data: { levelId: targetLevelId },
            });
        }
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemberService);
//# sourceMappingURL=member.service.js.map