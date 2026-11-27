import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  SmsChannelConfig,
  SmsClient,
  SmsSendRequest,
  SmsSendResult,
} from './sms-client.interface';

export class DebugSmsClient implements SmsClient {
  private readonly logger = new Logger(DebugSmsClient.name);

  constructor(private readonly config: SmsChannelConfig) {}

  async sendSms(req: SmsSendRequest): Promise<SmsSendResult> {
    const serialNo = `DEBUG_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    this.logger.log(
      `[SMS Debug/${this.config.code}] To=${req.mobile}, Sign=${this.config.signature}, Content="${req.content}", Serial=${serialNo}`,
    );
    return {
      success: true,
      serialNo,
    };
  }
}
