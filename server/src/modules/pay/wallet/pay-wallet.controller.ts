import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import {
  AdjustWalletBalanceDto,
  CreateRechargePackageDto,
  UpdateRechargePackageDto,
  WalletQueryDto,
} from './dto/wallet.dto';
import { PayWalletService } from './pay-wallet.service';

@ApiTags('支付中心 - 会员钱包')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/wallet')
export class PayWalletController {
  constructor(private readonly walletService: PayWalletService) {}

  @Get('page')
  @RequirePermissions('pay:wallet:query')
  @ApiOperation({ summary: '分页查询会员钱包列表' })
  async getPage(@Query() query: WalletQueryDto) {
    return this.walletService.findAllWallets(query);
  }

  @Get('get')
  @RequirePermissions('pay:wallet:query')
  @ApiOperation({ summary: '根据用户获取或初始化钱包信息' })
  async getWallet(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userType') userType?: string,
  ) {
    return this.walletService.getOrCreateWallet(
      userId,
      userType ? Number(userType) : 1,
    );
  }

  @Get('transaction/page')
  @RequirePermissions('pay:wallet:query')
  @ApiOperation({ summary: '分页查询钱包流水' })
  async getTransactions(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('walletId') walletId?: string,
  ) {
    return this.walletService.findTransactions({ page, pageSize, walletId });
  }

  @Post('adjust-balance')
  @RequirePermissions('pay:wallet:update')
  @Log({ module: '会员钱包', type: 'UPDATE', description: '管理员调整钱包余额' })
  @ApiOperation({ summary: '管理员调整钱包余额' })
  async adjustBalance(@Body() body: AdjustWalletBalanceDto) {
    return this.walletService.adjustBalanceByAdmin(
      body.userId,
      body.userType ?? 1,
      body.price,
      body.title ?? '后台余额调整',
    );
  }
}

@ApiTags('支付中心 - 钱包充值套餐')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/wallet-recharge-package')
export class PayWalletRechargePackageController {
  constructor(private readonly walletService: PayWalletService) {}

  @Get('list')
  @RequirePermissions('pay:wallet-recharge-package:query')
  @ApiOperation({ summary: '查询钱包充值套餐列表' })
  async list() {
    return this.walletService.findRechargePackages(false);
  }

  @Post('create')
  @RequirePermissions('pay:wallet-recharge-package:create')
  @Log({ module: '充值套餐', type: 'CREATE', description: '创建钱包充值套餐' })
  @ApiOperation({ summary: '创建钱包充值套餐' })
  async create(@Body() body: CreateRechargePackageDto) {
    return this.walletService.createRechargePackage(body);
  }

  @Put(':id')
  @RequirePermissions('pay:wallet-recharge-package:update')
  @Log({ module: '充值套餐', type: 'UPDATE', description: '修改钱包充值套餐' })
  @ApiOperation({ summary: '修改钱包充值套餐' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRechargePackageDto,
  ) {
    return this.walletService.updateRechargePackage(id, body);
  }

  @Delete(':id')
  @RequirePermissions('pay:wallet-recharge-package:delete')
  @Log({ module: '充值套餐', type: 'DELETE', description: '删除钱包充值套餐' })
  @ApiOperation({ summary: '删除钱包充值套餐' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.removeRechargePackage(id);
  }
}
