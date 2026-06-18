import { CmsCommentStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CommentQueryDto extends PaginationQueryDto {
    articleId?: number;
    status?: CmsCommentStatus;
}
