import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class UserQueryDto extends PaginationQueryDto {
    accountId?: number;
    keyword?: string;
    subscribeStatus?: number;
}
