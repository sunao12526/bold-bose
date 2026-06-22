import { IsOptional, IsString, IsEnum } from 'class-validator';
import { MallOrderStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

export class OrderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  no?: string;

  @IsOptional()
  @IsEnum(MallOrderStatus)
  status?: MallOrderStatus;
}
