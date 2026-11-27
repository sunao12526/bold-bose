import * as crypto from 'crypto';
import {
  SmsChannelConfig,
  SmsClient,
  SmsSendRequest,
  SmsSendResult,
} from './sms-client.interface';

function sha256Hex(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function hmacSha256(key: Buffer | string, msg: string): Buffer {
  return crypto.createHmac('sha256', key).update(msg).digest();
}

/**
 * 构建符合腾讯云 SMS v3 TC3-HMAC-SHA256 规范的 Authorization 头部
 */
export function buildTencentAuthHeader(
  secretId: string,
  secretKey: string,
  payloadJson: string,
  timestampSec = Math.floor(Date.now() / 1000),
): { authorization: string; timestamp: string } {
  const host = 'sms.tencentcloudapi.com';
  const service = 'sms';
  const date = new Date(timestampSec * 1000).toISOString().slice(0, 10);

  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\n`;
  const signedHeaders = 'content-type;host';
  const hashedPayload = sha256Hex(payloadJson);
  const canonicalRequest = [
    'POST',
    '/',
    '',
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
  ].join('\n');

  const credentialScope = `${date}/${service}/tc3_request`;
  const stringToSign = [
    'TC3-HMAC-SHA256',
    String(timestampSec),
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const secretDate = hmacSha256(`TC3${secretKey}`, date);
  const secretService = hmacSha256(secretDate, service);
  const secretSigning = hmacSha256(secretService, 'tc3_request');
  const signature = crypto
    .createHmac('sha256', secretSigning)
    .update(stringToSign)
    .digest('hex');

  const authorization =
    `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return { authorization, timestamp: String(timestampSec) };
}

export class TencentSmsClient implements SmsClient {
  constructor(private readonly config: SmsChannelConfig) {}

  async sendSms(req: SmsSendRequest): Promise<SmsSendResult> {
    if (!req.apiTemplateId) {
      return {
        success: false,
        errorMessage: '腾讯云短信模板未配置第三方模板 ID (apiTemplateId)',
      };
    }

    // 约定 apiKey 可以是 "SecretId" 或 "SecretId:SmsSdkAppId"
    const [secretId, sdkAppId = '1400000000'] = this.config.apiKey.split(':');
    const phone = req.mobile.startsWith('+') ? req.mobile : `+86${req.mobile}`;
    const templateParams = Object.values(req.params || {}).map((v) =>
      String(v),
    );

    const payload = JSON.stringify({
      PhoneNumberSet: [phone],
      SmsSdkAppId: sdkAppId,
      SignName: this.config.signature,
      TemplateId: req.apiTemplateId,
      TemplateParamSet: templateParams,
    });

    const { authorization, timestamp } = buildTencentAuthHeader(
      secretId,
      this.config.apiSecret,
      payload,
    );

    const res = await fetch('https://sms.tencentcloudapi.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Host: 'sms.tencentcloudapi.com',
        'X-TC-Action': 'SendSms',
        'X-TC-Version': '2021-01-11',
        'X-TC-Region': 'ap-guangzhou',
        'X-TC-Timestamp': timestamp,
        Authorization: authorization,
      },
      body: payload,
    });

    const data = (await res.json()) as any;
    const status = data?.Response?.SendStatusSet?.[0];
    if (status?.Code === 'Ok') {
      return {
        success: true,
        serialNo: status.SerialNo || '',
      };
    }
    return {
      success: false,
      errorMessage:
        status?.Message ||
        data?.Response?.Error?.Message ||
        'Tencent SMS send failed',
    };
  }
}
