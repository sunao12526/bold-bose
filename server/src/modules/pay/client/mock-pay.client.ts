import {
  PayClient,
  PayOrderSubmitRequest,
  PayOrderSubmitResult,
  PayParsedOrderNotify,
  PayParsedRefundNotify,
  PayRefundSubmitRequest,
  PayRefundSubmitResult,
} from './pay-client.interface';

export class MockPayClient implements PayClient {
  async submitOrder(req: PayOrderSubmitRequest): Promise<PayOrderSubmitResult> {
    return {
      status: 'SUCCESS',
      displayMode: 'none',
      displayInfo: '',
      channelOrderNo: `MOCK_${req.outTradeNo}`,
    };
  }

  async refundOrder(req: PayRefundSubmitRequest): Promise<PayRefundSubmitResult> {
    return {
      status: 'SUCCESS',
      channelRefundNo: `MOCK_REFUND_${req.outRefundNo}`,
    };
  }

  async verifyAndParseOrderNotify(
    _headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedOrderNotify> {
    return {
      outTradeNo: String(body.outTradeNo || body.merchantOrderId || ''),
      channelOrderNo: String(body.channelOrderNo || `MOCK_${Date.now()}`),
      status: 'SUCCESS',
      successTime: new Date(),
    };
  }

  async verifyAndParseRefundNotify(
    _headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedRefundNotify> {
    return {
      outRefundNo: String(body.outRefundNo || body.merchantRefundId || ''),
      channelRefundNo: String(body.channelRefundNo || `MOCK_REF_${Date.now()}`),
      status: 'SUCCESS',
      successTime: new Date(),
    };
  }
}
