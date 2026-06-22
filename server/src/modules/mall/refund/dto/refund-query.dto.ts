import { IsOptional, IsEnum } from 'class-validator';
import { MallRefundStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';

export class RefundQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(MallRefundStatus)
  status?: MallRefundStatus;
}
