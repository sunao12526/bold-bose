import { SetMetadata } from '@nestjs/common';

export interface LogOptions {
  module: string;
  type: string;
  description: string;
}

export const LOG_METADATA_KEY = 'log_metadata';
export const Log = (options: LogOptions) => SetMetadata(LOG_METADATA_KEY, options);
