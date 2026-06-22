import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
export declare class CouponQueryDto extends PaginationQueryDto {
    name?: string;
    status?: CommonStatus;
}
