import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { PayAppService } from './app.service';
import { PayAppController } from './app.controller';
import { PayChannelService } from './channel.service';
import { PayChannelController } from './channel.controller';
import { PayOrderService } from './pay-order.service';
import { PayOrderController } from './pay-order.controller';
import { PayRefundService } from './pay-refund.service';
import { PayRefundController } from './pay-refund.controller';
import { NotifyService } from './notify.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    PayAppController,
    PayChannelController,
    PayOrderController,
    PayRefundController,
  ],
  providers: [
    PayAppService,
    PayChannelService,
    PayOrderService,
    PayRefundService,
    NotifyService,
  ],
  exports: [
    PayOrderService,
    PayRefundService,
    NotifyService,
  ],
})
export class PayModule {}
