import { applyTenantToArgs, verifyTenantResult } from './tenant-prisma.helper';

describe('tenant-prisma.helper', () => {
  it('findMany 等查询应自动注入 tenantId 到 where', () => {
    const next = applyTenantToArgs(
      'User',
      'findMany',
      { where: { status: 'ENABLE' } },
      10,
      false,
    );
    expect(next.where).toEqual({ status: 'ENABLE', tenantId: 10 });
  });

  it('create 与 createMany 应自动注入 tenantId 到 data', () => {
    const single = applyTenantToArgs(
      'Role',
      'create',
      { data: { name: 'R1', code: 'r1' } },
      22,
      false,
    );
    expect(single.data.tenantId).toBe(22);

    const batch = applyTenantToArgs(
      'Post',
      'createMany',
      { data: [{ name: 'P1', code: 'p1', sort: 1 }, { name: 'P2', code: 'p2', sort: 2, tenantId: 99 }] },
      22,
      false,
    );
    expect(batch.data[0].tenantId).toBe(22);
    expect(batch.data[1].tenantId).toBe(99);
  });

  it('非租户模型或 ignore=true 时应原样透传', () => {
    const nonTenant = applyTenantToArgs('Menu', 'findMany', { where: { id: 1 } }, 10, false);
    expect(nonTenant.where).toEqual({ id: 1 });

    const ignored = applyTenantToArgs('User', 'findMany', { where: { id: 1 } }, 10, true);
    expect(ignored.where).toEqual({ id: 1 });
  });

  it('verifyTenantResult 应在 findUnique 跨租户时屏蔽返回 null', () => {
    const sameTenant = verifyTenantResult('User', 'findUnique', { id: 1, tenantId: 5 }, 5, false);
    expect(sameTenant).toEqual({ id: 1, tenantId: 5 });

    const crossTenant = verifyTenantResult('User', 'findUnique', { id: 2, tenantId: 6 }, 5, false);
    expect(crossTenant).toBeNull();

    expect(() =>
      verifyTenantResult('User', 'findUniqueOrThrow', { id: 2, tenantId: 6 }, 5, false),
    ).toThrow();
  });
});
