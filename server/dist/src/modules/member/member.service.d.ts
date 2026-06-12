import { PrismaService } from '../../shared/prisma/prisma.service';
import { CommonStatus } from '@prisma/client';
export declare class MemberService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: number): Promise<{
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateStatus(id: number, status: CommonStatus): Promise<{
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adjustPoints(id: number, amount: number): Promise<{
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adjustBalance(id: number, amountCents: number): Promise<{
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adjustExperience(id: number, amount: number): Promise<{
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    assignTags(id: number, tagIds: number[]): Promise<{
        level: {
            id: number;
            name: string;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            level: number;
            experience: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        nickname: string;
        mobile: string;
        experience: number;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateMemberLevel(memberId: number): Promise<void>;
}
