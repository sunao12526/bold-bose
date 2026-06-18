import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class MailLogQueryDto extends PaginationQueryDto {
    receiver?: string;
    status?: string;
    templateId?: number;
}
