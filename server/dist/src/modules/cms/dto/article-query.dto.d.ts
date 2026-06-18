import { CmsArticleStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class ArticleQueryDto extends PaginationQueryDto {
    categoryId?: number;
    status?: CmsArticleStatus;
    title?: string;
}
