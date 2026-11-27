import { AliyunSmsClient } from './aliyun-sms.client';
import { DebugSmsClient } from './debug-sms.client';
import { SmsChannelConfig, SmsClient } from './sms-client.interface';
import { TencentSmsClient } from './tencent-sms.client';

export class SmsClientFactory {
  static create(config: SmsChannelConfig): SmsClient {
    const code = (config.code || '').trim().toUpperCase();
    const isPlaceholder =
      !config.apiKey ||
      config.apiKey.includes('placeholder') ||
      config.apiKey.startsWith('mock_');

    if (isPlaceholder || code === 'DEBUG' || code === 'MOCK') {
      return new DebugSmsClient(config);
    }

    if (code === 'ALIYUN') {
      return new AliyunSmsClient(config);
    }
    if (code === 'TENCENT') {
      return new TencentSmsClient(config);
    }

    return new DebugSmsClient(config);
  }
}
