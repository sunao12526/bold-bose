import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_METADATA_KEY = 'idempotent_metadata_key';

export interface IdempotentOptions {
  /** Lock duration in milliseconds (default: 3000) */
  timeoutMs?: number;
  /** Error message returned when duplicate request is detected */
  message?: string;
  /** Optional custom key prefix */
  keyPrefix?: string;
  /** Whether to release lock immediately when handler throws an error (default: true) */
  deleteOnError?: boolean;
}

export const Idempotent = (options: IdempotentOptions = {}) =>
  SetMetadata(IDEMPOTENT_METADATA_KEY, options);
