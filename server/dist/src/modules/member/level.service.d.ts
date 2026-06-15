import { PrismaService } from '../../shared/prisma/prisma.service';
import { MemberService } from './member.service';
export declare class LevelService {
    private prisma;
    private memberService;
    constructor(prisma: PrismaService, memberService: MemberService);
    create(data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        experience: number;
        discountPercent: number;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        experience: number;
        discountPercent: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        experience: number;
        discountPercent: number;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        experience: number;
        discountPercent: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        level: number;
        experience: number;
        discountPercent: number;
    }>;
    private recalculateAllUsersLevels;
}
