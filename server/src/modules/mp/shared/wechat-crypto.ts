import * as crypto from 'crypto';

export class WechatCrypto {
  private key: Buffer;
  private iv: Buffer;

  constructor(private token: string, private aesKey: string, private appId: string) {
    // 微信的 EncodingAESKey 是 Base64 编码的，需要补齐 '=' 并转换
    this.key = Buffer.from(aesKey + '=', 'base64');
    this.iv = this.key.subarray(0, 16);
  }

  // 验证签名
  public checkSignature(timestamp: string, nonce: string, signature: string): boolean {
    const array = [this.token, timestamp, nonce].sort();
    const sha1 = crypto.createHash('sha1');
    sha1.update(array.join(''));
    return sha1.digest('hex') === signature;
  }

  // 验证安全模式消息签名
  public checkMsgSignature(timestamp: string, nonce: string, encrypt: string, signature: string): boolean {
    const array = [this.token, timestamp, nonce, encrypt].sort();
    const sha1 = crypto.createHash('sha1');
    sha1.update(array.join(''));
    return sha1.digest('hex') === signature;
  }

  // 解密微信消息
  public decrypt(encryptMsg: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    decipher.setAutoPadding(false); // 必须禁用自动填充，自己解 PKCS7
    let decrypted = Buffer.concat([decipher.update(encryptMsg, 'base64'), decipher.final()]);
    
    // 剥离 PKCS7 填充
    decrypted = this.pkcs7Decode(decrypted) as any;
    
    // 微信解密结果格式：
    // 16 字节随机字符串 + 4 字节的明文 XML 长度 + 明文 XML + appId
    // const randomStr = decrypted.slice(0, 16);
    const xmlLen = decrypted.readUInt32BE(16);
    const xmlMsg = decrypted.subarray(20, 20 + xmlLen).toString('utf-8');
    const fromAppId = decrypted.subarray(20 + xmlLen).toString('utf-8');
    
    if (fromAppId !== this.appId) {
      throw new Error('AppId不匹配，消息非法！');
    }
    return xmlMsg;
  }

  // 加密微信消息
  public encrypt(xmlMsg: string): { encrypt: string; signature: string; timestamp: string; nonce: string } {
    const randomStr = crypto.randomBytes(16);
    const xmlMsgBuf = Buffer.from(xmlMsg, 'utf-8');
    const xmlLenBuf = Buffer.alloc(4);
    xmlLenBuf.writeUInt32BE(xmlMsgBuf.length, 0);
    const appIdBuf = Buffer.from(this.appId, 'utf-8');
    
    const bodyBuf = Buffer.concat([randomStr, xmlLenBuf, xmlMsgBuf, appIdBuf]);
    const paddedBuf = this.pkcs7Encode(bodyBuf);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    cipher.setAutoPadding(false);
    const encrypted = Buffer.concat([cipher.update(paddedBuf), cipher.final()]).toString('base64');
    
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = Math.floor(Math.random() * 100000000).toString();
    
    const array = [this.token, timestamp, nonce, encrypted].sort();
    const signature = crypto.createHash('sha1').update(array.join('')).digest('hex');
    
    return {
      encrypt: encrypted,
      signature,
      timestamp,
      nonce
    };
  }

  private pkcs7Decode(buf: Buffer): Buffer {
    let pad = buf[buf.length - 1];
    if (pad < 1 || pad > 32) {
      pad = 0;
    }
    return buf.subarray(0, buf.length - pad);
  }

  private pkcs7Encode(buf: Buffer): Buffer {
    const blockSize = 32;
    const amountToPad = blockSize - (buf.length % blockSize);
    const padBuf = Buffer.alloc(amountToPad, amountToPad);
    return Buffer.concat([buf, padBuf]);
  }
}
