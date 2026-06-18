import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class MessageQueryDto extends PaginationQueryDto {
    accountId?: number;
    type?: string;
    openid?: string;
}
