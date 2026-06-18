import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination.dto';

export class MailAccountQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  mail?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
