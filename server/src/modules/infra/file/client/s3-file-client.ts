import { FileClient } from './file-client.interface';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  waitUntilBucketExists,
} from '@aws-sdk/client-s3';

export class S3FileClient implements FileClient {
  private client: S3Client;
  private bucket: string;
  private domain: string;

  constructor(config: {
    endpoint: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    domain: string;
  }) {
    this.bucket = config.bucket;
    this.domain = config.domain;
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      forcePathStyle: true,
    });
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      await waitUntilBucketExists(
        { client: this.client, maxWaitTime: 30 },
        { Bucket: this.bucket },
      );
    }
  }

  async upload(file: Buffer, filePath: string, mimeType: string): Promise<string> {
    await this.ensureBucket();
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
      Body: file,
      ContentType: mimeType,
    });
    await this.client.send(command);
    return `${this.domain}/${filePath}`;
  }

  async delete(filePath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });
    await this.client.send(command);
  }
}
