import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../shared/decorators/public.decorator';
import { MemberAuthGuard } from '../../member/app/member-auth.guard';
import { CreateWalletRechargeDto } from './dto/wallet.dto';
import { PayWalletService } from './pay-wallet.service';

@ApiTags('C端 - 会员钱包')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/pay')
export class AppPayWalletController {
  constructor(private readonly walletService: PayWalletService) {}

  @Get('wallet/get')
  @ApiOperation({ summary: '获取我的钱包信息' })
  async getWallet(@Req() req: any) {
    return this.walletService.getOrCreateWallet(req.user.id, 1);
  }

  @Get('wallet-recharge-package/list')
  @ApiOperation({ summary: '获取启用的充值套餐列表' })
  async listPackages() {
    return this.walletService.findRechargePackages(true);
  }

  @Post('wallet-recharge/create')
  @ApiOperation({ summary: '创建钱包充值订单' })
  async createRecharge(
    @Req() req: any,
    @Body() body: CreateWalletRechargeDto,
  ) {
    return this.walletService.createRecharge(req.user.id, body);
  }

  @Get('wallet-transaction/page')
  @ApiOperation({ summary: '分页查询我的钱包流水' })
  async getTransactionPage(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const wallet = await this.walletService.getOrCreateWallet(req.user.id, 1);
    return this.walletService.findTransactions({
      page,
      pageSize,
      walletId: wallet.id,
    });
  }
}
