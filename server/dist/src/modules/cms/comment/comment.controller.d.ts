import { CommentService } from './comment.service';
import { CommentQueryDto } from '../dto/comment-query.dto';
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    findAll(query: CommentQueryDto): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
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
