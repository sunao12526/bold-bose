import { ArticleService } from './article.service';
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
            content: string;
            status: import("@prisma/client").$Enums.CmsCommentStatus;
            createdAt: Date;
            id: number;
            articleId: number;
            userId: number | null;
            nickname: string;
        }[];
    } & {
        title: string;
        content: string | null;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        isTop: boolean;
        isRecommend: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        categoryId: number;
    }>;
    findAll(query: any): Promise<import("../../../shared/pagination").PaginatedResult<unknown>>;
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
            content: string;
            status: import("@prisma/client").$Enums.CmsCommentStatus;
            createdAt: Date;
            id: number;
            articleId: number;
            userId: number | null;
            nickname: string;
        }[];
    } & {
        title: string;
        content: string | null;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        isTop: boolean;
        isRecommend: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        categoryId: number;
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
            content: string;
            status: import("@prisma/client").$Enums.CmsCommentStatus;
            createdAt: Date;
            id: number;
            articleId: number;
            userId: number | null;
            nickname: string;
        }[];
    } & {
        title: string;
        content: string | null;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        isTop: boolean;
        isRecommend: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        categoryId: number;
    }>;
    remove(id: number): Promise<{
        title: string;
        content: string | null;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        isTop: boolean;
        isRecommend: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        categoryId: number;
    }>;
    updateStatus(id: number, status: string): Promise<{
        title: string;
        content: string | null;
        summary: string | null;
        coverUrl: string | null;
        author: string;
        viewCount: number;
        likeCount: number;
        sortOrder: number;
        status: import("@prisma/client").$Enums.CmsArticleStatus;
        isTop: boolean;
        isRecommend: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        categoryId: number;
    }>;
}
