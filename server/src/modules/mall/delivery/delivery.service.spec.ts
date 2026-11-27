import { calculateDeliveryPrice } from './delivery.service';

describe('DeliveryService calculateDeliveryPrice', () => {
  it('未配置模板或数量为 0 时运费为 0', () => {
    expect(calculateDeliveryPrice(null, 2, 5000)).toBe(0);
    expect(calculateDeliveryPrice({ basePrice: 1000, extraPrice: 500 }, 0, 5000)).toBe(0);
  });

  it('满足满额包邮阈值时运费应为 0', () => {
    expect(
      calculateDeliveryPrice(
        { basePrice: 1000, extraPrice: 500, freePrice: 9900 },
        3,
        9900,
      ),
    ).toBe(0);
  });

  it('未满包邮阈值时按首件 + 续件计算运费', () => {
    expect(
      calculateDeliveryPrice(
        { basePrice: 1000, extraPrice: 500, freePrice: 9900 },
        1,
        5000,
      ),
    ).toBe(1000);

    expect(
      calculateDeliveryPrice(
        { basePrice: 1000, extraPrice: 500, freePrice: 9900 },
        3,
        5000,
      ),
    ).toBe(2000);
  });
});
