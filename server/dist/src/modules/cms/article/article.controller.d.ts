import { ArticleService } from './article.service';
import { ArticleQueryDto } from '../dto/article-query.dto';
export declare class ArticleController {
    private articleService;
    constructor(articleService: ArticleService);
    create(data: any): Promise<{
        category: {
            id: number;
            name: string;
        };
        tags: ({
            tag: {
                id: number;
                name: string;
            };
        } & {
            articleId: number;
            tagId: number;
        })[];
        comments: {
            id: number;
            status: import("@prisma/client").$Enums.CmsCommentStatus;
            createdAt: Date;
            nickname: string;
            userId: number | null;
            content: string;
            articleId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        categoryId: number;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        isTop: boolean;
        isRecommend: boolean;
    }>;
    findAll(query: ArticleQueryDto): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        category: {
            id: number;
            name: string;
        };
        tags: ({
            tag: {
                id: number;
                name: string;
            };
        } & {
            articleId: number;
            tagId: number;
        })[];
        comments: {
            id: number;
            status: import("@prisma/client").$Enums.CmsCommentStatus;
            createdAt: Date;
            nickname: string;
            userId: number | null;
            content: string;
            articleId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        categoryId: number;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        isTop: boolean;
        isRecommend: boolean;
    }>;
    update(id: number, data: any): Promise<{
        category: {
            id: number;
            name: string;
        };
        tags: ({
            tag: {
                id: number;
                name: string;
            };
        } & {
            articleId: number;
            tagId: number;
        })[];
        comments: {
            id: number;
            status: import("@prisma/client").$Enums.CmsCommentStatus;
            createdAt: Date;
            nickname: string;
            userId: number | null;
            content: string;
            articleId: number;
        }[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        categoryId: number;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        isTop: boolean;
        isRecommend: boolean;
    }>;
    remove(id: number): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        categoryId: number;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        isTop: boolean;
        isRecommend: boolean;
    }>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string | null;
        categoryId: number;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        isTop: boolean;
        isRecommend: boolean;
    }>;
}
