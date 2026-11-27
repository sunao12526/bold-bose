import * as crypto from 'crypto';
import {
  AlipayPayClient,
  buildAlipaySignContent,
  signAlipayParams,
  verifyAlipaySignature,
} from './alipay-pay.client';
import {
  buildWechatV3AuthHeader,
  decryptWechatV3Resource,
} from './wechat-v3-pay.client';

describe('Pay Clients Crypto & Verify', () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  it('支付宝 RSA2 签名与回调验签应该闭环通过并拒绝篡改报文', async () => {
    // 1. 验证请求参数签名 (包含 sign_type)
    const reqParams = { app_id: '202100000001', sign_type: 'RSA2', out_trade_no: '1001' };
    const reqSign = signAlipayParams(reqParams, privateKey);
    const reqVerifier = crypto.createVerify('RSA-SHA256');
    reqVerifier.update(buildAlipaySignContent(reqParams, false), 'utf8');
    expect(reqVerifier.verify(publicKey, reqSign, 'base64')).toBe(true);

    // 2. 验证异步通知验签 (支付宝异步通知签名剔除 sign 与 sign_type)
    const notifyPayload: Record<string, any> = {
      app_id: '202100000001',
      out_trade_no: '1001',
      trade_no: '202601012200140001',
      trade_status: 'TRADE_SUCCESS',
      total_amount: '99.00',
      sign_type: 'RSA2',
    };
    const notifySigner = crypto.createSign('RSA-SHA256');
    notifySigner.update(buildAlipaySignContent(notifyPayload, true), 'utf8');
    notifyPayload.sign = notifySigner.sign(privateKey, 'base64');

    expect(verifyAlipaySignature(notifyPayload, publicKey)).toBe(true);
    expect(
      verifyAlipaySignature(
        { ...notifyPayload, total_amount: '0.01' },
        publicKey,
      ),
    ).toBe(false);

    const client = new AlipayPayClient({
      appId: '202100000001',
      privateKey,
      alipayPublicKey: publicKey,
      sandbox: true,
    });
    const parsed = await client.verifyAndParseOrderNotify({}, notifyPayload);
    expect(parsed.outTradeNo).toBe('1001');
    expect(parsed.status).toBe('SUCCESS');

    const submitRes = await client.submitOrder({
      outTradeNo: '1001',
      subject: '测试订单',
      price: 9900,
      notifyUrl: 'https://example.com/notify',
      channelCode: 'alipay_pc',
    });
    expect(submitRes.status).toBe('WAITING');
    expect(submitRes.displayInfo).toContain('openapi-sandbox.dl.alipaydev.com');
  });

  it('微信支付 V3 Authorization 签名与 AES-256-GCM 回调解密应该闭环通过', () => {
    const authHeader = buildWechatV3AuthHeader(
      'POST',
      '/v3/pay/transactions/native',
      '{"out_trade_no":"1002"}',
      { mchId: '1900000109', mchSerialNo: 'SER001', privateKey },
      '1767225600',
      'nonce123',
    );
    expect(authHeader).toContain('WECHATPAY2-SHA256-RSA2048 mchid="1900000109"');
    expect(authHeader).toContain('serial_no="SER001"');

    // 使用 32 字节 APIv3Key 加密并解密模拟微信回调密文
    const apiV3Key = '12345678901234567890123456789012';
    const nonce = '123456789012';
    const aad = 'transaction';
    const plainJson = JSON.stringify({
      out_trade_no: '1002',
      transaction_id: 'wx_tx_999',
      trade_state: 'SUCCESS',
    });

    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(apiV3Key, 'utf8'),
      Buffer.from(nonce, 'utf8'),
    );
    cipher.setAAD(Buffer.from(aad, 'utf8'));
    const encrypted = Buffer.concat([
      cipher.update(plainJson, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    const ciphertext = Buffer.concat([encrypted, authTag]).toString('base64');

    const decrypted = decryptWechatV3Resource(apiV3Key, aad, nonce, ciphertext);
    expect(decrypted).toEqual({
      out_trade_no: '1002',
      transaction_id: 'wx_tx_999',
      trade_state: 'SUCCESS',
    });
  });
});
