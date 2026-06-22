import { MallRefundStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
export declare class RefundQueryDto extends PaginationQueryDto {
    status?: MallRefundStatus;
}
