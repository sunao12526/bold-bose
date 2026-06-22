import { MallOrderStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
export declare class OrderQueryDto extends PaginationQueryDto {
    no?: string;
    status?: MallOrderStatus;
}
