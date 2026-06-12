import { FileClient } from './file-client.interface';
export declare class LocalFileClient implements FileClient {
    private baseFolder;
    private domain;
    constructor(config: {
        baseFolder?: string;
        domain?: string;
    });
    upload(file: Buffer, filePath: string): Promise<string>;
    delete(filePath: string): Promise<void>;
}
