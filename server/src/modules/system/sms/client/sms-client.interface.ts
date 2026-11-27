export interface SmsChannelConfig {
  code: string;
  apiKey: string;
  apiSecret: string;
  signature: string;
}

export interface SmsSendRequest {
  mobile: string;
  content: string;
  apiTemplateId?: string | null;
  params: Record<string, any>;
}

export interface SmsSendResult {
  success: boolean;
  serialNo?: string;
  errorMessage?: string;
}

export interface SmsClient {
  sendSms(req: SmsSendRequest): Promise<SmsSendResult>;
}
