import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PayWalletService, WalletBizType } from './pay-wallet.service';

describe('PayWalletService', () => {
  let service: PayWalletService;

  const mockTx = {
    payWallet: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payWalletTransaction: {
      create: jest.fn(),
    },
    payWalletRecharge: {
      create: jest.fn(),
      update: jest.fn(),
    },
    payOrder: {
      create: jest.fn(),
    },
  };

  const mockPrisma = {
    payWallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    payWalletRecharge: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payWalletRechargePackage: {
      findUnique: jest.fn(),
    },
    payApp: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb(mockTx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayWalletService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PayWalletService>(PayWalletService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reduceBalance 在余额不足时应抛出 BadRequestException 防止透支', async () => {
    mockTx.payWallet.findUnique.mockResolvedValueOnce({ id: 1, balance: 500 });

    await expect(
      service.reduceBalance(1, 1000, WalletBizType.PAYMENT, 'ORD1', '支付消费'),
    ).rejects.toThrow(BadRequestException);
    expect(mockTx.payWallet.update).not.toHaveBeenCalled();
  });

  it('addBalance 应该原子增加余额、累计充值并生成流水', async () => {
    mockTx.payWallet.findUnique.mockResolvedValueOnce({ id: 1, balance: 200 });
    mockTx.payWallet.update.mockResolvedValueOnce({ id: 1, balance: 1200 });
    mockTx.payWalletTransaction.create.mockResolvedValueOnce({ id: 9, price: 1000, balance: 1200 });

    const res = await service.addBalance(
      1,
      1000,
      WalletBizType.RECHARGE,
      'REC1',
      '钱包充值',
    );
    expect(res.wallet.balance).toBe(1200);
    expect(mockTx.payWallet.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        balance: 1200,
        totalRecharge: { increment: 1000 },
      },
    });
  });

  it('updateRechargePaid 应幂等处理：已支付的充值单不重复入账', async () => {
    mockPrisma.payWalletRecharge.findUnique.mockResolvedValueOnce({
      id: 3,
      payStatus: true,
    });

    const res = await service.updateRechargePaid(3, 99, 'mock');
    expect(res?.payStatus).toBe(true);
    expect(mockPrisma.payWalletRecharge.update).not.toHaveBeenCalled();
  });
});
