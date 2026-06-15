import { SignInService } from './sign-in.service';
import { CommonStatus } from '@prisma/client';
export declare class SignInController {
    private signInService;
    constructor(signInService: SignInService);
    findAllConfigs(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        day: number;
        point: number;
    }[]>;
    updateConfig(day: number, point: number, status: CommonStatus): Promise<{
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
        point: number;
        memberId: number;
    })[]>;
    signIn(id: number): Promise<{
        record: {
            id: number;
            createdAt: Date;
            day: number;
            point: number;
            memberId: number;
        };
        pointsRewarded: number;
        consecutiveDays: number;
    }>;
}
