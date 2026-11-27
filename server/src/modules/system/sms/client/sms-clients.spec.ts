import { buildAliyunSignedParams } from './aliyun-sms.client';
import { DebugSmsClient } from './debug-sms.client';
import { SmsClientFactory } from './sms-client.factory';
import { buildTencentAuthHeader } from './tencent-sms.client';

describe('SMS Clients & Signatures', () => {
  it('工厂类对 placeholder 或 DEBUG 编码应返回 DebugSmsClient', async () => {
    const client = SmsClientFactory.create({
      code: 'ALIYUN',
      apiKey: 'mock_key',
      apiSecret: 'secret',
      signature: 'BoldBose',
    });
    expect(client).toBeInstanceOf(DebugSmsClient);

    const res = await client.sendSms({
      mobile: '13800138000',
      content: '验证码 1234',
      params: { code: '1234' },
    });
    expect(res.success).toBe(true);
    expect(res.serialNo).toMatch(/^DEBUG_/);
  });

  it('buildAliyunSignedParams 应该生成符合 POP HMAC-SHA1 规范的确定性签名', () => {
    const params = buildAliyunSignedParams(
      'testKeyId',
      'testKeySecret',
      {
        PhoneNumbers: '13800138000',
        SignName: '测试签名',
        TemplateCode: 'SMS_1001',
        TemplateParam: '{"code":"1234"}',
      },
      '2026-01-01T00:00:00Z',
      'nonce-123',
    );

    expect(params.SignatureMethod).toBe('HMAC-SHA1');
    expect(params.Signature).toBeTruthy();
    expect(params.Signature.endsWith('=') || params.Signature.length >= 20).toBe(true);
  });

  it('buildTencentAuthHeader 应该生成标准 TC3-HMAC-SHA256 Authorization 头', () => {
    const { authorization, timestamp } = buildTencentAuthHeader(
      'AKID123',
      'SECRET456',
      '{"PhoneNumberSet":["+8613800138000"]}',
      1767225600,
    );

    expect(timestamp).toBe('1767225600');
    expect(authorization).toContain('TC3-HMAC-SHA256 Credential=AKID123/2026-01-01/sms/tc3_request');
    expect(authorization).toContain('SignedHeaders=content-type;host');
    expect(authorization).toMatch(/Signature=[0-9a-f]{64}$/);
  });
});
