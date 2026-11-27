import * as crypto from 'crypto';
import {
  SmsChannelConfig,
  SmsClient,
  SmsSendRequest,
  SmsSendResult,
} from './sms-client.interface';

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

/**
 * 构建符合阿里云 Dysmsapi POP 规范 (HMAC-SHA1) 的签名参数
 */
export function buildAliyunSignedParams(
  accessKeyId: string,
  accessKeySecret: string,
  bizParams: Record<string, string>,
  timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  nonce = crypto.randomUUID(),
): Record<string, string> {
  const allParams: Record<string, string> = {
    AccessKeyId: accessKeyId,
    Action: 'SendSms',
    Format: 'JSON',
    RegionId: 'cn-hangzhou',
    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: nonce,
    SignatureVersion: '1.0',
    Timestamp: timestamp,
    Version: '2017-05-25',
    ...bizParams,
  };

  const sortedKeys = Object.keys(allParams).sort();
  const canonicalizedQuery = sortedKeys
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join('&');

  const stringToSign = `POST&${percentEncode('/')}&${percentEncode(canonicalizedQuery)}`;
  const signature = crypto
    .createHmac('sha1', `${accessKeySecret}&`)
    .update(stringToSign)
    .digest('base64');

  return {
    ...allParams,
    Signature: signature,
  };
}

export class AliyunSmsClient implements SmsClient {
  constructor(private readonly config: SmsChannelConfig) {}

  async sendSms(req: SmsSendRequest): Promise<SmsSendResult> {
    if (!req.apiTemplateId) {
      return {
        success: false,
        errorMessage: '阿里云短信模板未配置第三方模板 ID (apiTemplateId)',
      };
    }

    const signed = buildAliyunSignedParams(
      this.config.apiKey,
      this.config.apiSecret,
      {
        PhoneNumbers: req.mobile,
        SignName: this.config.signature,
        TemplateCode: req.apiTemplateId,
        TemplateParam: JSON.stringify(req.params || {}),
      },
    );

    const body = new URLSearchParams(signed).toString();
    const res = await fetch('https://dysmsapi.aliyuncs.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    const data = (await res.json()) as any;
    if (data.Code === 'OK') {
      return {
        success: true,
        serialNo: data.BizId || '',
      };
    }
    return {
      success: false,
      errorMessage: data.Message || `Aliyun SMS error: ${data.Code}`,
    };
  }
}
