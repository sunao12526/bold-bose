import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';
export declare class OAuth2ClientQueryDto extends PaginationQueryDto {
    clientId?: string;
    name?: string;
    status?: string;
}
