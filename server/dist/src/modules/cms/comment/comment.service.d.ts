import { PrismaService } from '../../../shared/prisma/prisma.service';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(articleId: number, data: any): Promise<{
        userId: number | null;
        nickname: string;
        content: string;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        id: number;
        articleId: number;
    }>;
    findAll(query?: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        userId: number | null;
        nickname: string;
        content: string;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        id: number;
        articleId: number;
    }>;
    approve(id: number): Promise<{
        userId: number | null;
        nickname: string;
        content: string;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        id: number;
        articleId: number;
    }>;
    reject(id: number): Promise<{
        userId: number | null;
        nickname: string;
        content: string;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        id: number;
        articleId: number;
    }>;
    remove(id: number): Promise<{
        userId: number | null;
        nickname: string;
        content: string;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        id: number;
        articleId: number;
    }>;
}
