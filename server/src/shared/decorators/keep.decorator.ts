import { SetMetadata } from '@nestjs/common';

export const KEEP_METADATA_KEY = 'keep_metadata_key';
export const Keep = () => SetMetadata(KEEP_METADATA_KEY, true);
