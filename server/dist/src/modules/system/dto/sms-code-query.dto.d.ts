import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class SmsCodeQueryDto extends PaginationQueryDto {
    mobile?: string;
    used?: string;
}
