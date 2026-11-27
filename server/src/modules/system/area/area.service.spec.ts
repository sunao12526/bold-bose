import { AreaService } from './area.service';
import { IpService } from '../../../shared/ip/ip.service';

describe('AreaService', () => {
  let service: AreaService;
  const mockIpService = {
    search: jest.fn(),
  } as unknown as jest.Mocked<IpService>;

  beforeEach(() => {
    service = new AreaService(mockIpService);
  });

  it('应该返回完整的省级行政区划树并支持编码查找与格式化', () => {
    const tree = service.getTree();
    expect(tree.length).toBeGreaterThanOrEqual(34);

    const beijing = service.getById(110000);
    expect(beijing?.name).toBe('北京市');

    expect(service.format(110105)).toBe('北京市 朝阳区');
    expect(service.format(440300, '/')).toBe('广东省/深圳市');
    expect(service.format(999999)).toBe('');
  });

  it('getAreaByIp 应该调用 IpService 返回归属地', async () => {
    mockIpService.search.mockResolvedValue('中国 广东 深圳');
    const res = await service.getAreaByIp('113.108.1.1');
    expect(res).toEqual({ ip: '113.108.1.1', area: '中国 广东 深圳' });
  });
});
