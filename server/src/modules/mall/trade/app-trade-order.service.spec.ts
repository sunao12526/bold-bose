import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CommonStatus,
  MallCouponType,
  MallCouponUserStatus,
  MallOrderStatus,
} from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PayOrderService } from '../../pay/pay-order.service';
import { DeliveryService } from '../delivery/delivery.service';
import { AppTradeOrderService } from './app-trade-order.service';

describe('AppTradeOrderService', () => {
  let service: AppTradeOrderService;

  const mockTx = {
    mallSku: { updateMany: jest.fn(), update: jest.fn() },
    mallSpu: { update: jest.fn() },
    mallCouponUser: { updateMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    mallCoupon: { update: jest.fn() },
    mallOrder: { create: jest.fn(), update: jest.fn() },
    mallCart: { deleteMany: jest.fn() },
  };

  const mockPrisma = {
    mallCart: { findMany: jest.fn() },
    mallSku: { findMany: jest.fn() },
    mallCouponUser: { findUnique: jest.fn() },
    memberAddress: { findUnique: jest.fn() },
    mallOrder: { findUnique: jest.fn(), update: jest.fn() },
    payApp: { findUnique: jest.fn(), findFirst: jest.fn() },
    $transaction: jest.fn((cb: any) => cb(mockTx)),
  };

  const mockDeliveryService = {
    findTemplateById: jest.fn(),
  };

  const mockPayOrderService = {
    createPayOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppTradeOrderService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: DeliveryService, useValue: mockDeliveryService },
        { provide: PayOrderService, useValue: mockPayOrderService },
      ],
    }).compile();

    service = module.get<AppTradeOrderService>(AppTradeOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('settlement 应正确计算 SKU 小计、现金券抵扣与运费', async () => {
    mockPrisma.mallSku.findMany.mockResolvedValueOnce([
      {
        id: 1,
        spuId: 10,
        price: 5000,
        stock: 20,
        picUrl: 'sku.png',
        properties: [],
        spu: { id: 10, name: '商品A', picUrl: 'spu.png', status: CommonStatus.ENABLE },
      },
    ]);
    mockPrisma.mallCouponUser.findUnique.mockResolvedValueOnce({
      id: 7,
      memberId: 100,
      status: MallCouponUserStatus.UNUSED,
      validStartTime: new Date(Date.now() - 10000),
      validEndTime: new Date(Date.now() + 100000),
      coupon: { type: MallCouponType.CASH, minPrice: 8000, value: 1500 },
    });
    mockDeliveryService.findTemplateById.mockResolvedValueOnce({
      basePrice: 1000,
      extraPrice: 200,
      freePrice: 20000,
    });

    const calc = await service.settlement(100, {
      items: [{ skuId: 1, count: 2 }],
      couponId: 7,
    });

    expect(calc.totalCount).toBe(2);
    expect(calc.totalPrice).toBe(10000);
    expect(calc.couponPrice).toBe(1500);
    expect(calc.deliveryPrice).toBe(1200);
    expect(calc.payPrice).toBe(9700);
  });

  it('createOrder 在库存并发扣减失败时应抛出 BadRequestException', async () => {
    mockPrisma.memberAddress.findUnique.mockResolvedValueOnce({
      id: 1,
      memberId: 100,
      name: '张三',
      mobile: '13800138000',
      detailAddress: '北京市',
    });
    mockPrisma.mallSku.findMany.mockResolvedValueOnce([
      {
        id: 1,
        spuId: 10,
        price: 5000,
        stock: 5,
        picUrl: null,
        properties: [],
        spu: { id: 10, name: '商品A', picUrl: 'spu.png', status: CommonStatus.ENABLE },
      },
    ]);
    mockDeliveryService.findTemplateById.mockResolvedValueOnce(null);
    mockTx.mallSku.updateMany.mockResolvedValueOnce({ count: 0 });

    await expect(
      service.createOrder(100, {
        addressId: 1,
        items: [{ skuId: 1, count: 2 }],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findMyOrderDetail 访问他人订单应抛出 ForbiddenException', async () => {
    mockPrisma.mallOrder.findUnique.mockResolvedValueOnce({
      id: 99,
      memberId: 200,
      status: MallOrderStatus.UNPAID,
    });

    await expect(service.findMyOrderDetail(100, 99)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
