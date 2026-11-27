import { ExcelService } from './excel.service';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(() => {
    service = new ExcelService();
  });

  it('应该将对象数组导出为 xlsx Buffer 并能正确反向解析', () => {
    const rows = [
      { id: 1, username: 'alice', status: 'ENABLE', createdAt: new Date('2026-01-01T08:00:00Z') },
      { id: 2, username: 'bob', status: 'DISABLE', createdAt: new Date('2026-01-02T09:30:00Z') },
    ];

    const buffer = service.exportToBuffer(
      rows,
      [
        { header: '编号', key: 'id', width: 10 },
        { header: '用户名', key: 'username', width: 16 },
        {
          header: '状态',
          key: 'status',
          width: 12,
          formatter: (r) => (r.status === 'ENABLE' ? '启用' : '禁用'),
        },
        { header: '创建时间', key: 'createdAt', width: 22 },
      ],
      '用户',
    );

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(100);

    const parsed = service.parseExcelBuffer(buffer);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({
      编号: 1,
      用户名: 'alice',
      状态: '启用',
      创建时间: '2026-01-01 08:00:00',
    });
    expect(parsed[1]['状态']).toBe('禁用');
  });

  it('sendExcelResponse 应该设置正确的响应头并写出 Buffer', () => {
    const setHeader = jest.fn();
    const send = jest.fn();
    const res = { setHeader, send } as any;

    service.sendExcelResponse(
      res,
      '导出测试',
      [{ name: '测试项' }],
      [{ header: '名称', key: 'name' }],
    );

    expect(setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      expect.stringContaining('filename*=UTF-8'),
    );
    expect(send).toHaveBeenCalledWith(expect.any(Buffer));
  });
});
