import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {
  MailAccountController,
  MailTemplateController,
  MailLogController,
} from './mail.controller';

@Module({
  controllers: [
    MailAccountController,
    MailTemplateController,
    MailLogController,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
