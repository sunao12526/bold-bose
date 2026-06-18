import { CommonStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class BannerQueryDto extends PaginationQueryDto {
    title?: string;
    status?: CommonStatus;
}
