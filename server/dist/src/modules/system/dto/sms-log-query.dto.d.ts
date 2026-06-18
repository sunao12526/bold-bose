import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class SmsLogQueryDto extends PaginationQueryDto {
    mobile?: string;
    status?: string;
    templateId?: number;
}
