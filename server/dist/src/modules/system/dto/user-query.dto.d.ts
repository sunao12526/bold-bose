import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class UserQueryDto extends PaginationQueryDto {
    username?: string;
    nickname?: string;
    mobile?: string;
    status?: CommonStatus;
    deptId?: number;
}
