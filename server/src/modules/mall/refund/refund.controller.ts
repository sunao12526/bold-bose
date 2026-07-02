import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RefundService } from './refund.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { Public } from '../../../shared/decorators/public.decorator';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { RefundQueryDto } from './dto/refund-query.dto';
import { RefundNotifyDto, RefundAuditDto, RefundRejectDto } from '../dto/mall-input.dto';
import { MallOrderRefundResponseDto, MallOrderRefundListResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 退款售后')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/refund')
export class RefundController {
  constructor(private refundService: RefundService) {}

  @Public()
  @Post('notify')
  @ApiOperation({ summary: '内部退款处理结果异步通知接口' })
  @ApiOkResponse({ type: String })
  async refundNotify(
    @Body() data: RefundNotifyDto,
  ) {
    await this.refundService.refundNotify(
      data.merchantRefundId,
      data.refundId,
      data.status,
      data.refundTime,
    );
    return 'success';
  }

  @Get()
  @RequirePermissions('mall:refund:query')
  @ApiOperation({ summary: '分页查询退款单列表' })
  @ApiOkResponse({ type: MallOrderRefundListResponseDto })
  async findAll(@Query() query: RefundQueryDto) {
    return this.refundService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('mall:refund:query')
  @ApiOperation({ summary: '根据 ID 获取退款单详情' })
  @ApiOkResponse({ type: MallOrderRefundResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.findOne(id);
  }

  @Put(':id/approve')
  @RequirePermissions('mall:refund:update')
  @Log({ module: '退款售后', type: 'UPDATE', description: '同意退款申请' })
  @ApiOperation({ summary: '审核通过退款售后申请' })
  @ApiOkResponse({ type: MallOrderRefundResponseDto })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RefundAuditDto,
  ) {
    return this.refundService.approve(id, data.auditRemark);
  }

  @Put(':id/reject')
  @RequirePermissions('mall:refund:update')
  @Log({ module: '退款售后', type: 'UPDATE', description: '拒绝退款申请' })
  @ApiOperation({ summary: '拒绝退款售后申请' })
  @ApiOkResponse({ type: MallOrderRefundResponseDto })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RefundRejectDto,
  ) {
    return this.refundService.reject(id, data.auditRemark);
  }
}

