import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisService } from '../../shared/redis/redis.service';

export interface CaptchaResult {
  key: string;
  image: string;
}

const CAPTCHA_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);

  constructor(private readonly redisService: RedisService) {}

  async generate(): Promise<CaptchaResult> {
    const code = this.randomCode(4);
    const key = crypto.randomUUID();
    await this.redisService.set(
      `captcha:${key}`,
      code.toLowerCase(),
      CAPTCHA_TTL_MS,
    );
    this.logger.log(`Generated: key=${key}`);
    return { key, image: this.renderSvg(code) };
  }

  async verify(key: string, input: string): Promise<boolean> {
    if (!key || !input) {
      return false;
    }
    this.logger.log(`Verifying: key=${key}`);
    const storedCode = await this.redisService.getAndDelete(`captcha:${key}`);
    if (!storedCode) {
      this.logger.log(`Verify failed: no record or expired for key=${key}`);
      return false;
    }
    const result = storedCode === input.toLowerCase();
    this.logger.log(`Verify: key=${key}, match=${result}`);
    return result;
  }

  private randomCode(len: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    const buf = crypto.randomBytes(len);
    for (let i = 0; i < len; i++) {
      code += chars[buf[i] % chars.length];
    }
    return code;
  }

  private renderSvg(text: string): string {
    const width = 120;
    const height = 40;
    const bg = '#f0f2f5';
    const textColor = () => {
      const colors = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect width="${width}" height="${height}" fill="${bg}" rx="4"/>`;

    for (let i = 0; i < 4; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = Math.random() * width;
      const y2 = Math.random() * height;
      const color = textColor();
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;
    }

    for (let i = 0; i < 30; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const r = Math.random() * 2;
      const color = textColor();
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.4"/>`;
    }

    const chars = text.split('');
    chars.forEach((char, i) => {
      const x = 15 + i * 25;
      const y = 28;
      const rotate = Math.floor(Math.random() * 20) - 10;
      const color = textColor();
      svg += `<text x="${x}" y="${y}" font-size="22" font-weight="bold" font-family="monospace" fill="${color}" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    });

    svg += '</svg>';
    return svg;
  }
}
