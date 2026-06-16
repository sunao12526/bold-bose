import { CommentService } from './comment.service';
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    findAll(query: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
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
