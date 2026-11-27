import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { MemberModule } from '../member/member.module';
import { PayAppService } from './app.service';
import { PayAppController } from './app.controller';
import { PayChannelService } from './channel.service';
import { PayChannelController } from './channel.controller';
import { PayOrderService } from './pay-order.service';
import { PayOrderController } from './pay-order.controller';
import { PayRefundService } from './pay-refund.service';
import { PayRefundController } from './pay-refund.controller';
import { PayNotifyController } from './pay-notify.controller';
import { NotifyService } from './notify.service';
import { PayWalletService } from './wallet/pay-wallet.service';
import {
  PayWalletController,
  PayWalletRechargePackageController,
} from './wallet/pay-wallet.controller';
import { AppPayWalletController } from './wallet/app-pay-wallet.controller';

@Module({
  imports: [PrismaModule, MemberModule],
  controllers: [
    PayAppController,
    PayChannelController,
    PayOrderController,
    PayRefundController,
    PayNotifyController,
    PayWalletController,
    PayWalletRechargePackageController,
    AppPayWalletController,
  ],
  providers: [
    PayAppService,
    PayChannelService,
    PayOrderService,
    PayRefundService,
    NotifyService,
    PayWalletService,
  ],
  exports: [PayOrderService, PayRefundService, NotifyService, PayWalletService],
})
export class PayModule {}
