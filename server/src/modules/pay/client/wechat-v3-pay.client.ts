import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  PayClient,
  PayOrderSubmitRequest,
  PayOrderSubmitResult,
  PayParsedOrderNotify,
  PayParsedRefundNotify,
  PayRefundSubmitRequest,
  PayRefundSubmitResult,
} from './pay-client.interface';

export interface WechatV3Config {
  appId: string;
  mchId: string;
  apiV3Key: string;
  mchSerialNo: string;
  privateKey: string;
  platformPublicKey?: string;
}

function formatPrivatePem(key: string): string {
  const trimmed = (key || '').trim();
  if (trimmed.includes('-----BEGIN')) return trimmed;
  const lines = trimmed.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
}

function formatPublicPem(key: string): string {
  const trimmed = (key || '').trim();
  if (trimmed.includes('-----BEGIN')) return trimmed;
  const lines = trimmed.match(/.{1,64}/g) || [];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

/**
 * 构建微信支付 V3 Authorization 请求头 (WECHATPAY2-SHA256-RSA2048)
 */
export function buildWechatV3AuthHeader(
  method: string,
  urlPath: string,
  body: string,
  config: Pick<WechatV3Config, 'mchId' | 'mchSerialNo' | 'privateKey'>,
  timestamp = String(Math.floor(Date.now() / 1000)),
  nonce = crypto.randomBytes(16).toString('hex'),
): string {
  const message = `${method.toUpperCase()}\n${urlPath}\n${timestamp}\n${nonce}\n${body}\n`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(message, 'utf8');
  const signature = signer.sign(formatPrivatePem(config.privateKey), 'base64');

  return (
    `WECHATPAY2-SHA256-RSA2048 ` +
    `mchid="${config.mchId}",nonce_str="${nonce}",timestamp="${timestamp}",serial_no="${config.mchSerialNo}",signature="${signature}"`
  );
}

/**
 * 解密微信支付 V3 AES-256-GCM 回调密文 resource
 */
export function decryptWechatV3Resource(
  apiV3Key: string,
  associatedData: string,
  nonce: string,
  ciphertext: string,
): Record<string, any> {
  const buf = Buffer.from(ciphertext, 'base64');
  const authTag = buf.subarray(buf.length - 16);
  const encrypted = buf.subarray(0, buf.length - 16);

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(apiV3Key, 'utf8'),
    Buffer.from(nonce, 'utf8'),
  );
  decipher.setAuthTag(authTag);
  if (associatedData) {
    decipher.setAAD(Buffer.from(associatedData, 'utf8'));
  }

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8');
  return JSON.parse(decrypted);
}

export class WechatV3PayClient implements PayClient {
  private readonly baseUrl = 'https://api.mch.weixin.qq.com';

  constructor(private readonly config: WechatV3Config) {}

  private async request(method: string, path: string, bodyObj: any) {
    const body = JSON.stringify(bodyObj);
    const authorization = buildWechatV3AuthHeader(
      method,
      path,
      body,
      this.config,
    );
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: authorization,
      },
      body,
    });
    const data = (await res.json()) as any;
    if (!res.ok) {
      throw new BadRequestException(
        data?.message || `微信支付请求失败 (${res.status})`,
      );
    }
    return data;
  }

  async submitOrder(req: PayOrderSubmitRequest): Promise<PayOrderSubmitResult> {
    const isJsapi = req.channelCode === 'wx_pub' || req.channelCode === 'wx_lite';
    const path = isJsapi
      ? '/v3/pay/transactions/jsapi'
      : req.channelCode === 'wx_wap'
        ? '/v3/pay/transactions/h5'
        : '/v3/pay/transactions/native';

    const payload: any = {
      appid: this.config.appId,
      mchid: this.config.mchId,
      description: req.subject,
      out_trade_no: req.outTradeNo,
      notify_url: req.notifyUrl,
      amount: { total: req.price, currency: 'CNY' },
    };
    if (isJsapi && req.openid) {
      payload.payer = { openid: req.openid };
    }

    const data = await this.request('POST', path, payload);
    return {
      status: 'WAITING',
      displayMode: data.code_url ? 'qr_code' : data.h5_url ? 'url' : 'app',
      displayInfo: data.code_url || data.h5_url || data.prepay_id || '',
      raw: data,
    };
  }

  async refundOrder(req: PayRefundSubmitRequest): Promise<PayRefundSubmitResult> {
    const data = await this.request('POST', '/v3/refund/domestic/refunds', {
      out_trade_no: req.outTradeNo,
      out_refund_no: req.outRefundNo,
      reason: req.reason,
      ...(req.notifyUrl ? { notify_url: req.notifyUrl } : {}),
      amount: {
        refund: req.refundPrice,
        total: req.totalPrice,
        currency: 'CNY',
      },
    });
    const st = data.status === 'SUCCESS' ? 'SUCCESS' : 'WAITING';
    return {
      status: st,
      channelRefundNo: data.refund_id || req.outRefundNo,
    };
  }

  private verifyHeaderAndDecrypt(headers: Record<string, any>, body: any) {
    if (this.config.platformPublicKey) {
      const ts = headers['wechatpay-timestamp'] || headers['Wechatpay-Timestamp'];
      const nonce = headers['wechatpay-nonce'] || headers['Wechatpay-Nonce'];
      const sig = headers['wechatpay-signature'] || headers['Wechatpay-Signature'];
      const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
      const message = `${ts}\n${nonce}\n${rawBody}\n`;
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(message, 'utf8');
      const ok = verifier.verify(
        formatPublicPem(this.config.platformPublicKey),
        String(sig || ''),
        'base64',
      );
      if (!ok) {
        throw new BadRequestException('微信支付回调签名验证失败');
      }
    }

    const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
    const resource = parsedBody?.resource;
    if (!resource?.ciphertext) {
      throw new BadRequestException('无效的微信支付回调报文');
    }
    return decryptWechatV3Resource(
      this.config.apiV3Key,
      resource.associated_data || '',
      resource.nonce,
      resource.ciphertext,
    );
  }

  async verifyAndParseOrderNotify(
    headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedOrderNotify> {
    const plain = this.verifyHeaderAndDecrypt(headers, body);
    const tradeState = String(plain.trade_state || '');
    return {
      outTradeNo: String(plain.out_trade_no),
      channelOrderNo: String(plain.transaction_id || ''),
      status:
        tradeState === 'SUCCESS'
          ? 'SUCCESS'
          : tradeState === 'CLOSED'
            ? 'CLOSED'
            : 'WAITING',
      channelUserId: plain.payer?.openid ? String(plain.payer.openid) : undefined,
      successTime: plain.success_time ? new Date(plain.success_time) : new Date(),
    };
  }

  async verifyAndParseRefundNotify(
    headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedRefundNotify> {
    const plain = this.verifyHeaderAndDecrypt(headers, body);
    return {
      outRefundNo: String(plain.out_refund_no || ''),
      channelRefundNo: String(plain.refund_id || ''),
      status: plain.refund_status === 'SUCCESS' ? 'SUCCESS' : 'FAIL',
      successTime: plain.success_time ? new Date(plain.success_time) : new Date(),
    };
  }
}
