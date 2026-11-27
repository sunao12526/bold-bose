import { SetMetadata } from '@nestjs/common';

export const TENANT_IGNORE_KEY = 'tenant_ignore_key';
export const TenantIgnore = () => SetMetadata(TENANT_IGNORE_KEY, true);
