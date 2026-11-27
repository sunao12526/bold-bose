import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Public } from '../../../shared/decorators/public.decorator';
import { MemberAuthGuard } from '../../member/app/member-auth.guard';
import { InteractionService } from './interaction.service';

export const AppCreateCommentSchema = z.object({
  spuId: z.coerce.number().int(),
  skuId: z.coerce.number().int().optional(),
  orderId: z.coerce.number().int().optional(),
  orderItemId: z.coerce.number().int().optional(),
  anonymous: z.boolean().optional().default(false),
  scores: z.coerce.number().int().min(1).max(5),
  descriptionScores: z.coerce.number().int().min(1).max(5).optional(),
  benefitScores: z.coerce.number().int().min(1).max(5).optional(),
  content: z.string().min(1).max(1000),
  picUrls: z.array(z.string()).optional(),
});
export class AppCreateCommentDto extends createZodDto(AppCreateCommentSchema) {}

export const FavoriteSpuSchema = z.object({
  spuId: z.coerce.number().int(),
});
export class FavoriteSpuDto extends createZodDto(FavoriteSpuSchema) {}

@ApiTags('C端 - 商品评价与收藏')
@Public()
@Controller('app-api/mall/product')
export class AppProductInteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get('comment/page')
  @ApiOperation({ summary: '分页查看商品评价' })
  async getComments(
    @Query('spuId') spuId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.interactionService.findComments({
      spuId,
      page,
      pageSize,
      visible: true,
    });
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(MemberAuthGuard)
  @Post('comment/create')
  @ApiOperation({ summary: '发表商品评价' })
  async createComment(@Req() req: any, @Body() body: AppCreateCommentDto) {
    return this.interactionService.createComment(req.user.id, body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(MemberAuthGuard)
  @Post('favorite/create')
  @ApiOperation({ summary: '收藏商品' })
  async addFavorite(@Req() req: any, @Body() body: FavoriteSpuDto) {
    return this.interactionService.addFavorite(req.user.id, body.spuId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(MemberAuthGuard)
  @Delete('favorite/delete')
  @ApiOperation({ summary: '取消收藏商品' })
  async removeFavorite(@Req() req: any, @Query('spuId') spuId: string) {
    return this.interactionService.removeFavorite(req.user.id, Number(spuId));
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(MemberAuthGuard)
  @Get('favorite/exists')
  @ApiOperation({ summary: '检查是否已收藏商品' })
  async isFavorite(@Req() req: any, @Query('spuId') spuId: string) {
    return this.interactionService.isFavorite(req.user.id, Number(spuId));
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(MemberAuthGuard)
  @Get('favorite/page')
  @ApiOperation({ summary: '分页查询我的商品收藏' })
  async favoritePage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.interactionService.findFavorites(req.user.id, {
      page,
      pageSize,
    });
  }
}
