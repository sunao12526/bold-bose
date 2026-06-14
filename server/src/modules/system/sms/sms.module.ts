import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsChannelController, SmsTemplateController, SmsLogController } from './sms.controller';

@Module({
  controllers: [SmsChannelController, SmsTemplateController, SmsLogController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
