import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import {
  SmsChannelController,
  SmsTemplateController,
  SmsLogController,
} from './sms.controller';
import { SmsCodeService } from './sms-code.service';
import { SmsCodeController } from './sms-code.controller';

@Module({
  controllers: [
    SmsChannelController,
    SmsTemplateController,
    SmsLogController,
    SmsCodeController,
  ],
  providers: [SmsService, SmsCodeService],
  exports: [SmsService, SmsCodeService],
})
export class SmsModule {}
