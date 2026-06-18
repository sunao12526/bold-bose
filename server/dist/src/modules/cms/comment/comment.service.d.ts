import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(articleId: number, data: any): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        nickname: string;
        userId: number | null;
        content: string;
        articleId: number;
    }>;
    findAll(query?: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        nickname: string;
        userId: number | null;
        content: string;
        articleId: number;
    }>;
    approve(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        nickname: string;
        userId: number | null;
        content: string;
        articleId: number;
    }>;
    reject(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        nickname: string;
        userId: number | null;
        content: string;
        articleId: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        nickname: string;
        userId: number | null;
        content: string;
        articleId: number;
    }>;
}
