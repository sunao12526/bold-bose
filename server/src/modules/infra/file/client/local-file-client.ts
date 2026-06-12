import { FileClient } from './file-client.interface';
import * as fs from 'fs';
import * as path from 'path';

export class LocalFileClient implements FileClient {
  private baseFolder: string;
  private domain: string;

  constructor(config: { baseFolder?: string; domain?: string }) {
    this.baseFolder = config.baseFolder || './uploads';
    this.domain = config.domain || 'http://localhost:3000';
  }

  async upload(file: Buffer, filePath: string): Promise<string> {
    const fullPath = path.join(this.baseFolder, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, file);
    return `${this.domain}/uploads/${filePath}`;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseFolder, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
