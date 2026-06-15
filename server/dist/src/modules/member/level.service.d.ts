import { PrismaService } from '../../shared/prisma/prisma.service';
import { MemberService } from './member.service';
export declare class LevelService {
    private prisma;
    private memberService;
    constructor(prisma: PrismaService, memberService: MemberService);
    create(data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        experience: number;
        level: number;
        discountPercent: number;
    }>;
    findAll(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        experience: number;
        level: number;
        discountPercent: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        experience: number;
        level: number;
        discountPercent: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        experience: number;
        level: number;
        discountPercent: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        experience: number;
        level: number;
        discountPercent: number;
    }>;
    private recalculateAllUsersLevels;
}
