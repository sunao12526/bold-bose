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
import { MallOrderStatus } from '@prisma/client';
import { Public } from '../../../shared/decorators/public.decorator';
import { Idempotent } from '../../../shared/decorators/idempotent.decorator';
import { MemberAuthGuard } from '../../member/app/member-auth.guard';
import { AppTradeOrderService } from './app-trade-order.service';
import {
  CreateAfterSaleDto,
  CreateTradeOrderDto,
  TradeOrderSettlementDto,
} from './dto/trade.dto';

@ApiTags('C端 - 交易订单')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/mall/trade/order')
export class AppTradeOrderController {
  constructor(private readonly tradeOrderService: AppTradeOrderService) {}

  @Post('settlement')
  @ApiOperation({ summary: '订单结算价格试算' })
  async settlement(@Req() req: any, @Body() body: TradeOrderSettlementDto) {
    return this.tradeOrderService.settlement(req.user.id, body);
  }

  @Post('create')
  @Idempotent({ timeoutMs: 5000, message: '订单正在创建中，请勿重复提交' })
  @ApiOperation({ summary: '创建商城订单' })
  async create(@Req() req: any, @Body() body: CreateTradeOrderDto) {
    return this.tradeOrderService.createOrder(req.user.id, body);
  }

  @Get('page')
  @ApiOperation({ summary: '分页查询我的订单列表' })
  async page(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: MallOrderStatus,
  ) {
    return this.tradeOrderService.findMyOrders(req.user.id, {
      page,
      pageSize,
      status,
    });
  }

  @Get('get-detail')
  @ApiOperation({ summary: '获取我的订单详情' })
  async getDetail(@Req() req: any, @Query('id') id: string) {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException('无效的订单编号');
    }
    return this.tradeOrderService.findMyOrderDetail(req.user.id, parsed);
  }

  @Put('receive')
  @ApiOperation({ summary: '确认收货' })
  async receive(@Req() req: any, @Query('id') id: string) {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException('无效的订单编号');
    }
    return this.tradeOrderService.receiveOrder(req.user.id, parsed);
  }

  @Delete('cancel')
  @ApiOperation({ summary: '取消待支付订单' })
  async cancel(@Req() req: any, @Query('id') id: string) {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException('无效的订单编号');
    }
    return this.tradeOrderService.cancelOrder(req.user.id, parsed);
  }

  @Post('after-sale/create')
  @ApiOperation({ summary: '申请售后退款' })
  async createAfterSale(@Req() req: any, @Body() body: CreateAfterSaleDto) {
    return this.tradeOrderService.createAfterSale(req.user.id, body);
  }
}
