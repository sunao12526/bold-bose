import { TenantContext } from './tenant-context';

describe('TenantContext', () => {
  it('默认不在上下文中时应返回 undefined 和 ignore=false', () => {
    expect(TenantContext.getTenantId()).toBeUndefined();
    expect(TenantContext.isIgnore()).toBe(false);
  });

  it('run 应该在异步链中透传租户 ID，runIgnore 应临时忽略租户过滤', async () => {
    await TenantContext.run(42, async () => {
      expect(TenantContext.getTenantId()).toBe(42);
      expect(TenantContext.isIgnore()).toBe(false);

      await Promise.resolve();
      expect(TenantContext.getTenantId()).toBe(42);

      await TenantContext.runIgnore(async () => {
        expect(TenantContext.getTenantId()).toBe(42);
        expect(TenantContext.isIgnore()).toBe(true);
      });

      expect(TenantContext.isIgnore()).toBe(false);
    });

    expect(TenantContext.getTenantId()).toBeUndefined();
  });
});
