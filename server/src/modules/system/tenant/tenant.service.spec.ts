import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;

  const mockTx = {
    tenant: {
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockPrisma = {
    tenant: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tenantPackage: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb(mockTx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('禁止删除系统默认租户 (id=1)', async () => {
    await expect(service.remove(1)).rejects.toThrow(BadRequestException);
  });

  it('创建租户时若名称重复或套餐不存在应抛出 BadRequestException', async () => {
    mockPrisma.tenant.findUnique.mockResolvedValueOnce({ id: 2, name: 'Acme' });
    await expect(
      service.create({
        name: 'Acme',
        contactName: '张三',
        expireTime: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);

    mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
    mockPrisma.tenantPackage.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.create({
        name: 'Beta',
        contactName: '李四',
        packageId: 99,
        expireTime: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('创建租户并附带管理员账号时应在事务中创建租户和租户管理员', async () => {
    mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
    mockPrisma.tenantPackage.findUnique.mockResolvedValueOnce({ id: 1, name: '标准版' });
    mockTx.tenant.create.mockResolvedValueOnce({ id: 10, name: 'Gamma' });
    mockTx.user.findUnique.mockResolvedValueOnce(null);
    mockTx.user.create.mockResolvedValueOnce({ id: 50, username: 'gamma_admin' });
    mockTx.tenant.update.mockResolvedValueOnce({ id: 10, contactUserId: 50 });

    const res = await service.create({
      name: 'Gamma',
      contactName: '王五',
      packageId: 1,
      expireTime: new Date('2027-12-31'),
      username: 'gamma_admin',
      password: 'password123',
    });

    expect(res.id).toBe(10);
    expect(mockTx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          username: 'gamma_admin',
          tenantId: 10,
        }),
      }),
    );
    expect(mockTx.tenant.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { contactUserId: 50 },
    });
  });
});
