import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStore {
  tenantId?: number;
  ignore: boolean;
}

const storage = new AsyncLocalStorage<TenantStore>();

export const TenantContext = {
  run<T>(tenantId: number | undefined, fn: () => T, ignore = false): T {
    return storage.run({ tenantId, ignore }, fn);
  },

  runIgnore<T>(fn: () => T): T {
    const current = storage.getStore();
    return storage.run(
      { tenantId: current?.tenantId, ignore: true },
      fn,
    );
  },

  getStore(): TenantStore | undefined {
    return storage.getStore();
  },

  getTenantId(): number | undefined {
    return storage.getStore()?.tenantId;
  },

  isIgnore(): boolean {
    return storage.getStore()?.ignore ?? false;
  },
};
