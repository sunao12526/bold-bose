import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class SmsTemplateQueryDto extends PaginationQueryDto {
    code?: string;
    name?: string;
    status?: string;
}
