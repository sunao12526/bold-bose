export interface LogOptions {
    module: string;
    type: string;
    description: string;
}
export declare const LOG_METADATA_KEY = "log_metadata";
export declare const Log: (options: LogOptions) => import("@nestjs/common").CustomDecorator<string>;
