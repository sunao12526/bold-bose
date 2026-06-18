import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class PostsQueryDto extends PaginationQueryDto {
    name?: string;
    code?: string;
    status?: CommonStatus;
}
