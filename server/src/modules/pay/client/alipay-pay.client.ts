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

export interface AlipayConfig {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  serverUrl?: string;
  sandbox?: boolean;
}

function formatPem(key: string, type: 'PRIVATE KEY' | 'PUBLIC KEY'): string {
  const trimmed = (key || '').trim();
  if (trimmed.includes('-----BEGIN')) {
    return trimmed;
  }
  const lines = trimmed.match(/.{1,64}/g) || [];
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`;
}

export function buildAlipaySignContent(
  params: Record<string, any>,
  excludeSignType = false,
): string {
  return Object.keys(params)
    .filter((k) => {
      if (k === 'sign') return false;
      if (excludeSignType && k === 'sign_type') return false;
      const val = params[k];
      return val !== undefined && val !== null && val !== '';
    })
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

export function signAlipayParams(
  params: Record<string, any>,
  privateKey: string,
): string {
  const content = buildAlipaySignContent(params, false);
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(content, 'utf8');
  return signer.sign(formatPem(privateKey, 'PRIVATE KEY'), 'base64');
}

export function verifyAlipaySignature(
  params: Record<string, any>,
  alipayPublicKey: string,
): boolean {
  const sign = params.sign;
  if (!sign || !alipayPublicKey) return false;
  const content = buildAlipaySignContent(params, true);
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(content, 'utf8');
  try {
    return verifier.verify(
      formatPem(alipayPublicKey, 'PUBLIC KEY'),
      String(sign),
      'base64',
    );
  } catch {
    return false;
  }
}

export class AlipayPayClient implements PayClient {
  private readonly gatewayUrl: string;

  constructor(private readonly config: AlipayConfig) {
    this.gatewayUrl =
      config.serverUrl ||
      (config.sandbox
        ? 'https://openapi-sandbox.dl.alipaydev.com/gateway.do'
        : 'https://openapi.alipay.com/gateway.do');
  }

  private formatTimestamp(): string {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
  }

  async submitOrder(req: PayOrderSubmitRequest): Promise<PayOrderSubmitResult> {
    const method =
      req.channelCode === 'alipay_wap'
        ? 'alipay.trade.wap.pay'
        : req.channelCode === 'alipay_qr'
          ? 'alipay.trade.precreate'
          : 'alipay.trade.page.pay';

    const params: Record<string, string> = {
      app_id: this.config.appId,
      method,
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: this.formatTimestamp(),
      version: '1.0',
      notify_url: req.notifyUrl,
      ...(req.returnUrl ? { return_url: req.returnUrl } : {}),
      biz_content: JSON.stringify({
        out_trade_no: req.outTradeNo,
        total_amount: (req.price / 100).toFixed(2),
        subject: req.subject,
        product_code:
          method === 'alipay.trade.wap.pay'
            ? 'QUICK_WAP_WAY'
            : 'FAST_INSTANT_TRADE_PAY',
      }),
    };

    const sign = signAlipayParams(params, this.config.privateKey);
    const query = new URLSearchParams({ ...params, sign }).toString();

    return {
      status: 'WAITING',
      displayMode: method === 'alipay.trade.precreate' ? 'qr_code' : 'url',
      displayInfo: `${this.gatewayUrl}?${query}`,
    };
  }

  async refundOrder(req: PayRefundSubmitRequest): Promise<PayRefundSubmitResult> {
    const params: Record<string, string> = {
      app_id: this.config.appId,
      method: 'alipay.trade.refund',
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: this.formatTimestamp(),
      version: '1.0',
      biz_content: JSON.stringify({
        out_trade_no: req.outTradeNo,
        out_request_no: req.outRefundNo,
        refund_amount: (req.refundPrice / 100).toFixed(2),
        refund_reason: req.reason,
      }),
    };

    const sign = signAlipayParams(params, this.config.privateKey);
    const res = await fetch(this.gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ ...params, sign }).toString(),
    });
    const data = (await res.json()) as any;
    const resp = data?.alipay_trade_refund_response;
    if (resp?.code === '10000') {
      return {
        status: 'SUCCESS',
        channelRefundNo: resp.trade_no || req.outRefundNo,
      };
    }
    return {
      status: 'FAIL',
      errorMessage: resp?.sub_msg || resp?.msg || '支付宝退款失败',
    };
  }

  async verifyAndParseOrderNotify(
    _headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedOrderNotify> {
    if (!verifyAlipaySignature(body || {}, this.config.alipayPublicKey)) {
      throw new BadRequestException('支付宝异步通知签名验证失败');
    }

    const tradeStatus = String(body.trade_status || '');
    const status =
      tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED'
        ? 'SUCCESS'
        : tradeStatus === 'TRADE_CLOSED'
          ? 'CLOSED'
          : 'WAITING';

    return {
      outTradeNo: String(body.out_trade_no),
      channelOrderNo: String(body.trade_no || ''),
      status,
      channelUserId: body.buyer_id ? String(body.buyer_id) : undefined,
      successTime: body.gmt_payment ? new Date(body.gmt_payment) : new Date(),
    };
  }

  async verifyAndParseRefundNotify(
    _headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedRefundNotify> {
    if (!verifyAlipaySignature(body || {}, this.config.alipayPublicKey)) {
      throw new BadRequestException('支付宝退款通知签名验证失败');
    }
    return {
      outRefundNo: String(body.out_biz_no || body.out_request_no || ''),
      channelRefundNo: String(body.trade_no || ''),
      status: 'SUCCESS',
      successTime: new Date(),
    };
  }
}
