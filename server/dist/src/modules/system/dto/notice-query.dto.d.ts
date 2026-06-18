import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class NoticeQueryDto extends PaginationQueryDto {
    title?: string;
    type?: number;
    status?: string;
}
