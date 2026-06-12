import { FileClient } from './file-client.interface';
export declare class S3FileClient implements FileClient {
    private client;
    private bucket;
    private domain;
    constructor(config: {
        endpoint: string;
        bucket: string;
        accessKey: string;
        secretKey: string;
        domain: string;
    });
    upload(file: Buffer, filePath: string, mimeType: string): Promise<string>;
    delete(filePath: string): Promise<void>;
}
