import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class RoleQueryDto extends PaginationQueryDto {
    name?: string;
    code?: string;
    status?: CommonStatus;
}
