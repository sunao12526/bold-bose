import { CommentService } from './comment.service';
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    findAll(query: any): Promise<({
        article: {
            id: number;
            title: string;
        };
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CmsCommentStatus;
        createdAt: Date;
        nickname: string;
        userId: number | null;
        content: string;
        articleId: number;
    })[]>;
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
