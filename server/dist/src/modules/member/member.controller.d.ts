import { MemberService } from './member.service';
import { CommonStatus } from '@prisma/client';
export declare class MemberController {
    private memberService;
    constructor(memberService: MemberService);
    findAll(): Promise<({
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: number): Promise<{
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateStatus(id: number, status: CommonStatus): Promise<{
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adjustPoints(id: number, amount: number): Promise<{
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adjustBalance(id: number, amount: number): Promise<{
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    adjustExperience(id: number, amount: number): Promise<{
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    assignTags(id: number, tagIds: number[]): Promise<{
        level: {
            id: number;
            status: import("@prisma/client").$Enums.CommonStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            experience: number;
            level: number;
            discountPercent: number;
        } | null;
    } & {
        id: number;
        nickname: string;
        mobile: string;
        status: import("@prisma/client").$Enums.CommonStatus;
        createdAt: Date;
        updatedAt: Date;
        avatar: string | null;
        points: number;
        balance: number;
        levelId: number | null;
        experience: number;
        tagIds: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
