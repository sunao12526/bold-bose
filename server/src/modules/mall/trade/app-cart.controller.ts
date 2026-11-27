import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../shared/decorators/public.decorator';
import { MemberAuthGuard } from '../../member/app/member-auth.guard';
import { CartService } from './cart.service';
import {
  AddCartDto,
  UpdateCartCountDto,
  UpdateCartSelectedDto,
} from './dto/trade.dto';

@ApiTags('C端 - 购物车')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/mall/trade/cart')
export class AppCartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: '加入购物车' })
  async add(@Req() req: any, @Body() body: AddCartDto) {
    return this.cartService.add(req.user.id, body.skuId, body.count);
  }

  @Put('update-count')
  @ApiOperation({ summary: '修改购物车商品数量' })
  async updateCount(@Req() req: any, @Body() body: UpdateCartCountDto) {
    return this.cartService.updateCount(req.user.id, body.id, body.count);
  }

  @Put('update-selected')
  @ApiOperation({ summary: '修改购物车商品选中状态' })
  async updateSelected(@Req() req: any, @Body() body: UpdateCartSelectedDto) {
    return this.cartService.updateSelected(
      req.user.id,
      body.ids,
      body.selected,
    );
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除购物车商品' })
  async remove(@Req() req: any, @Query('ids') idsStr: string) {
    if (!idsStr) {
      throw new BadRequestException('ids 参数不能为空');
    }
    const ids = idsStr
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0);
    return this.cartService.remove(req.user.id, ids);
  }

  @Get('list')
  @ApiOperation({ summary: '获取购物车商品列表' })
  async list(@Req() req: any) {
    return this.cartService.list(req.user.id);
  }

  @Get('get-count')
  @ApiOperation({ summary: '获取购物车商品总数量' })
  async getCount(@Req() req: any) {
    return this.cartService.getCount(req.user.id);
  }
}
