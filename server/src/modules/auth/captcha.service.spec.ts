import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';
import { RedisService } from '../../shared/redis/redis.service';

describe('CaptchaService', () => {
  let service: CaptchaService;

  const mockRedisService = {
    set: jest.fn(),
    getAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchaService,
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<CaptchaService>(CaptchaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generate 应该生成 SVG 并将小写验证码写入 Redis', async () => {
    mockRedisService.set.mockResolvedValue(undefined);

    const result = await service.generate();

    expect(result.key).toBeTruthy();
    expect(result.image).toContain('<svg');
    expect(mockRedisService.set).toHaveBeenCalledWith(
      `captcha:${result.key}`,
      expect.stringMatching(/^[a-z0-9]{4}$/),
      5 * 60 * 1000,
    );
  });

  it('verify 应该一次性原子消费验证码并忽略大小写校验', async () => {
    mockRedisService.getAndDelete.mockResolvedValueOnce('ab12');
    await expect(service.verify('k1', 'AB12')).resolves.toBe(true);
    expect(mockRedisService.getAndDelete).toHaveBeenCalledWith('captcha:k1');

    mockRedisService.getAndDelete.mockResolvedValueOnce(null);
    await expect(service.verify('k1', 'AB12')).resolves.toBe(false);

    mockRedisService.getAndDelete.mockResolvedValueOnce('ab12');
    await expect(service.verify('k2', 'wrong')).resolves.toBe(false);
  });
});
