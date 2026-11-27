import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';
import { InteractionService } from './interaction.service';

export const CommentQuerySchema = PaginationQuerySchema.extend({
  spuId: z.coerce.number().int().optional(),
  spuName: z.string().optional(),
  visible: z.string().optional(),
  replyStatus: z.string().optional(),
});
export class CommentQueryDto extends createZodDto(CommentQuerySchema) {}

export const UpdateVisibleSchema = z.object({
  visible: z.boolean(),
});
export class UpdateVisibleDto extends createZodDto(UpdateVisibleSchema) {}

export const ReplyCommentSchema = z.object({
  replyContent: z.string().min(1).max(1000),
});
export class ReplyCommentDto extends createZodDto(ReplyCommentSchema) {}

@ApiTags('商城中心 - 商品评价')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/product/comment')
export class ProductCommentController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get()
  @RequirePermissions('mall:comment:query')
  @ApiOperation({ summary: '分页查询商品评价列表' })
  async findAll(@Query() query: CommentQueryDto) {
    return this.interactionService.findComments(query);
  }

  @Put(':id/visible')
  @RequirePermissions('mall:comment:update')
  @ApiOperation({ summary: '修改商品评价显示状态' })
  async updateVisible(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVisibleDto,
  ) {
    return this.interactionService.updateCommentVisible(id, body.visible);
  }

  @Put(':id/reply')
  @RequirePermissions('mall:comment:update')
  @ApiOperation({ summary: '商家回复商品评价' })
  async reply(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReplyCommentDto,
    @Req() req: any,
  ) {
    return this.interactionService.replyComment(
      id,
      req.user.id,
      body.replyContent,
    );
  }
}
