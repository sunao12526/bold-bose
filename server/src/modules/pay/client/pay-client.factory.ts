import { BadRequestException } from '@nestjs/common';
import { AlipayPayClient } from './alipay-pay.client';
import { MockPayClient } from './mock-pay.client';
import { PayClient } from './pay-client.interface';
import { WechatV3PayClient } from './wechat-v3-pay.client';

export class PayClientFactory {
  static create(channelCode: string, config: any): PayClient {
    const code = (channelCode || '').toLowerCase();
    if (code === 'mock') {
      return new MockPayClient();
    }
    if (code.startsWith('alipay')) {
      return new AlipayPayClient(config || {});
    }
    if (code.startsWith('wx') || code.startsWith('wechat')) {
      return new WechatV3PayClient(config || {});
    }
    throw new BadRequestException(`不支持的支付渠道类型: ${channelCode}`);
  }
}
