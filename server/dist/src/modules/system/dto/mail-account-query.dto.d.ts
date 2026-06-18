import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class MailAccountQueryDto extends PaginationQueryDto {
    mail?: string;
    username?: string;
    status?: string;
}
