"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileClient = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3FileClient {
    client;
    bucket;
    domain;
    constructor(config) {
        this.bucket = config.bucket;
        this.domain = config.domain;
        this.client = new client_s3_1.S3Client({
            endpoint: config.endpoint,
            region: 'us-east-1',
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
            },
            forcePathStyle: true,
        });
    }
    async ensureBucket() {
        try {
            await this.client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucket }));
        }
        catch {
            await this.client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucket }));
            await (0, client_s3_1.waitUntilBucketExists)({ client: this.client, maxWaitTime: 30 }, { Bucket: this.bucket });
        }
    }
    async upload(file, filePath, mimeType) {
        await this.ensureBucket();
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: filePath,
            Body: file,
            ContentType: mimeType,
        });
        await this.client.send(command);
        return `${this.domain}/${filePath}`;
    }
    async delete(filePath) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: filePath,
        });
        await this.client.send(command);
    }
}
exports.S3FileClient = S3FileClient;
//# sourceMappingURL=s3-file-client.js.map