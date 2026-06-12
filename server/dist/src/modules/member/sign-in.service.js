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
exports.SignInService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let SignInService = class SignInService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllConfigs() {
        return this.prisma.memberSignInConfig.findMany({
            orderBy: { day: 'asc' },
        });
    }
    async updateConfig(day, point, status) {
        const config = await this.prisma.memberSignInConfig.findUnique({
            where: { day },
        });
        if (!config) {
            return this.prisma.memberSignInConfig.create({
                data: {
                    day,
                    point: Number(point),
                    status: status || client_1.CommonStatus.ENABLE,
                },
            });
        }
        return this.prisma.memberSignInConfig.update({
            where: { day },
            data: {
                point: Number(point),
                status,
            },
        });
    }
    async findAllRecords() {
        return this.prisma.memberSignInRecord.findMany({
            include: {
                member: { select: { id: true, nickname: true, mobile: true } },
            },
            orderBy: { id: 'desc' },
        });
    }
    async signIn(memberId) {
        const member = await this.prisma.memberUser.findUnique({
            where: { id: memberId },
        });
        if (!member)
            throw new common_1.NotFoundException('会员不存在');
        if (member.status !== client_1.CommonStatus.ENABLE) {
            throw new common_1.BadRequestException('该会员已被禁用，无法签到');
        }
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const todayRecord = await this.prisma.memberSignInRecord.findFirst({
            where: {
                memberId,
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
        });
        if (todayRecord) {
            throw new common_1.BadRequestException('今日已签到，请明天再来');
        }
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayRecord = await this.prisma.memberSignInRecord.findFirst({
            where: {
                memberId,
                createdAt: {
                    gte: yesterdayStart,
                    lte: yesterdayEnd,
                },
            },
        });
        let nextConsecutiveDay = 1;
        if (yesterdayRecord) {
            nextConsecutiveDay = yesterdayRecord.day + 1;
            if (nextConsecutiveDay > 7) {
                nextConsecutiveDay = 1;
            }
        }
        const config = await this.prisma.memberSignInConfig.findUnique({
            where: { day: nextConsecutiveDay },
        });
        const pointsRewarded = config && config.status === client_1.CommonStatus.ENABLE ? config.point : 0;
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.memberSignInRecord.create({
                data: {
                    memberId,
                    day: nextConsecutiveDay,
                    point: pointsRewarded,
                },
            });
            if (pointsRewarded > 0) {
                await tx.memberUser.update({
                    where: { id: memberId },
                    data: {
                        points: { increment: pointsRewarded },
                    },
                });
            }
            return {
                record,
                pointsRewarded,
                consecutiveDays: nextConsecutiveDay,
            };
        });
    }
};
exports.SignInService = SignInService;
exports.SignInService = SignInService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SignInService);
//# sourceMappingURL=sign-in.service.js.map