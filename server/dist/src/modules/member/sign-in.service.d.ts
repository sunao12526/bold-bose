import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';
export declare class SignInService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllConfigs(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        day: number;
        point: number;
    }[]>;
    updateConfig(day: number, point: number, status?: CommonStatus): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        day: number;
        point: number;
    }>;
    findAllRecords(): Promise<({
        member: {
            id: number;
            nickname: string;
            mobile: string;
        };
    } & {
        id: number;
        createdAt: Date;
        day: number;
        memberId: number;
        point: number;
    })[]>;
    signIn(memberId: number): Promise<{
        record: {
            id: number;
            createdAt: Date;
            day: number;
            memberId: number;
            point: number;
        };
        pointsRewarded: number;
        consecutiveDays: number;
    }>;
}
