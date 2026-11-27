import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { SocialService } from './social.service';

describe('SocialService', () => {
  let service: SocialService;

  const mockPrisma = {
    socialClient: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    socialUser: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SocialService>(SocialService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('创建社交应用配置时应校验平台类型唯一性并规范为大写', async () => {
    mockPrisma.socialClient.findUnique.mockResolvedValueOnce({ id: 1, type: 'GITHUB' });
    await expect(
      service.createClient({
        type: 'github',
        clientId: 'cid',
        clientSecret: 'sec',
        redirectUri: 'http://localhost',
      }),
    ).rejects.toThrow(BadRequestException);

    mockPrisma.socialClient.findUnique.mockResolvedValueOnce(null);
    mockPrisma.socialClient.create.mockResolvedValueOnce({ id: 2, type: 'WECHAT' });
    const created = await service.createClient({
      type: 'wechat',
      clientId: 'cid',
      clientSecret: 'sec',
      redirectUri: 'http://localhost',
    });
    expect(created.type).toBe('WECHAT');
  });

  it('查询不存在的社交用户绑定记录应抛出 NotFoundException', async () => {
    mockPrisma.socialUser.findUnique.mockResolvedValueOnce(null);
    await expect(service.findOneUser(999)).rejects.toThrow(NotFoundException);
  });

  it('解绑社交用户应校验存在后删除', async () => {
    mockPrisma.socialUser.findUnique.mockResolvedValueOnce({ id: 10, openid: 'oid' });
    mockPrisma.socialUser.delete.mockResolvedValueOnce({ id: 10 });
    await expect(service.removeUser(10)).resolves.toEqual({ id: 10 });
    expect(mockPrisma.socialUser.delete).toHaveBeenCalledWith({ where: { id: 10 } });
  });
});
