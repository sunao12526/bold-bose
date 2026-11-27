import { safeJsonStringify, sanitizePayload } from './sanitize.util';

describe('sanitize.util', () => {
  it('应该递归脱敏敏感字段并保留普通字段', () => {
    const input = {
      username: 'admin',
      password: 'secret-password',
      nested: {
        clientSecret: 'abc',
        accessToken: 'jwt-token',
        refreshToken: 'ref-token',
        remark: 'hello',
      },
      list: [{ oldPassword: '123', name: 'item1' }],
    };

    const output = sanitizePayload(input) as any;
    expect(output.username).toBe('admin');
    expect(output.password).toBe('***');
    expect(output.nested.clientSecret).toBe('***');
    expect(output.nested.accessToken).toBe('***');
    expect(output.nested.refreshToken).toBe('***');
    expect(output.nested.remark).toBe('hello');
    expect(output.list[0].oldPassword).toBe('***');
    expect(output.list[0].name).toBe('item1');
  });

  it('safeJsonStringify 应该按最大长度截断', () => {
    const text = safeJsonStringify({ a: 'x'.repeat(200), password: '123' }, 40);
    expect(text).toBeTruthy();
    expect(text!.length).toBeLessThanOrEqual(40);
    expect(safeJsonStringify(undefined)).toBeNull();
  });
});
