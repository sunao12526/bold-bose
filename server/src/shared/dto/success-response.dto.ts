import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const SuccessResponseSchema = z.object({
  success: z.boolean().describe('执行操作是否成功'),
  message: z.string().optional().describe('提示消息'),
});

export class SuccessResponseDto extends createZodDto(SuccessResponseSchema) {}
