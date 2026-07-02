import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Searcher from 'ip2region-ts';

@Injectable()
export class IpService implements OnModuleInit {
  private readonly logger = new Logger(IpService.name);
  private searcher: any;

  onModuleInit() {
    try {
      const dbPath = Searcher.defaultDbFile;
      this.searcher = Searcher.newWithFileOnly(dbPath);
      this.logger.log(`ip2region searcher initialized successfully with db: ${dbPath}`);
    } catch (err: any) {
      this.logger.error('Failed to initialize ip2region searcher:', err.stack || err);
    }
  }

  async search(ip: string): Promise<string> {
    if (!ip) {
      return '未知位置';
    }
    const cleanIp = ip.trim();
    if (
      cleanIp === '127.0.0.1' ||
      cleanIp === '::1' ||
      cleanIp.startsWith('192.168.') ||
      cleanIp.startsWith('10.') ||
      cleanIp.startsWith('172.16.') ||
      cleanIp.startsWith('172.17.') ||
      cleanIp.startsWith('172.18.') ||
      cleanIp.startsWith('172.19.') ||
      cleanIp.startsWith('172.20.') ||
      cleanIp.startsWith('172.30.') ||
      cleanIp.startsWith('172.31.')
    ) {
      return '内网IP';
    }

    if (!this.searcher) {
      return '未知位置';
    }

    try {
      const result = await this.searcher.search(cleanIp);
      if (result && result.region) {
        // region format: 国家|区域|省份|城市|ISP
        // e.g. 中国|0|江苏省|苏州市|电信
        const parts = result.region.split('|');
        const country = parts[0] === '0' ? '' : parts[0];
        const province = parts[2] === '0' ? '' : parts[2];
        const city = parts[3] === '0' ? '' : parts[3];
        const isp = parts[4] === '0' ? '' : parts[4];

        const locArr = [country, province, city].filter(Boolean);
        let location = locArr.join(' ');
        if (isp && isp !== '0') {
          location += ` ${isp}`;
        }
        return location || '未知位置';
      }
      return '未知位置';
    } catch (err: any) {
      this.logger.warn(`Failed to parse IP [${cleanIp}]: ${err.message || err}`);
      return '未知位置';
    }
  }
}
