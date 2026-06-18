import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class CategoryQueryDto extends PaginationQueryDto {
    name?: string;
    code?: string;
    status?: CommonStatus;
}
