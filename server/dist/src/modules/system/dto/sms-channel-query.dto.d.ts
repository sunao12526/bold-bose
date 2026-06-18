import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class SmsChannelQueryDto extends PaginationQueryDto {
    code?: string;
    name?: string;
    status?: string;
}
