export interface PayOrderSubmitRequest {
  outTradeNo: string;
  subject: string;
  price: number; // 分
  notifyUrl: string;
  returnUrl?: string;
  openid?: string;
  channelCode: string;
}

export interface PayOrderSubmitResult {
  status: 'SUCCESS' | 'WAITING';
  displayMode: 'url' | 'qr_code' | 'app' | 'none';
  displayInfo: string;
  channelOrderNo?: string;
  raw?: any;
}

export interface PayRefundSubmitRequest {
  outTradeNo: string;
  outRefundNo: string;
  totalPrice: number;
  refundPrice: number;
  reason: string;
  notifyUrl?: string;
}

export interface PayRefundSubmitResult {
  status: 'SUCCESS' | 'WAITING' | 'FAIL';
  channelRefundNo?: string;
  errorMessage?: string;
}

export interface PayParsedOrderNotify {
  outTradeNo: string;
  channelOrderNo: string;
  status: 'SUCCESS' | 'WAITING' | 'CLOSED';
  channelUserId?: string;
  successTime: Date;
}

export interface PayParsedRefundNotify {
  outRefundNo: string;
  channelRefundNo: string;
  status: 'SUCCESS' | 'FAIL';
  successTime: Date;
}

export interface PayClient {
  submitOrder(req: PayOrderSubmitRequest): Promise<PayOrderSubmitResult>;
  refundOrder(req: PayRefundSubmitRequest): Promise<PayRefundSubmitResult>;
  verifyAndParseOrderNotify(
    headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedOrderNotify>;
  verifyAndParseRefundNotify(
    headers: Record<string, any>,
    body: any,
  ): Promise<PayParsedRefundNotify>;
}
