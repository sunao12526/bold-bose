export interface FileClient {
  upload(file: Buffer, path: string, mimeType: string): Promise<string>;
  delete(path: string): Promise<void>;
}
