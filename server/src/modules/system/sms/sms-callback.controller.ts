import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../shared/decorators/public.decorator';
import { Keep } from '../../../shared/decorators/keep.decorator';
import { SmsService } from './sms.service';

@ApiTags('系统 - 短信回执回调')
@Public()
@Keep()
@Controller('system/sms/callback')
export class SmsCallbackController {
  constructor(private readonly smsService: SmsService) {}

  @Post(':channelCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '接收第三方短信发送状态回执回调' })
  async receive(
    @Param('channelCode') channelCode: string,
    @Body() body: any,
  ) {
    const result = await this.smsService.receiveCallback(channelCode, body);
    if (channelCode.toUpperCase() === 'ALIYUN') {
      return { code: 0, msg: '成功', ...result };
    }
    if (channelCode.toUpperCase() === 'TENCENT') {
      return { result: 0, errmsg: 'OK', ...result };
    }
    return { success: true, ...result };
  }
}
