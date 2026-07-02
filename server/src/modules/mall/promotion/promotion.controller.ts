import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { PromotionService } from './promotion.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CouponQueryDto } from './dto/coupon-query.dto';
import { CreateMallCouponDto, UpdateMallCouponStatusDto, SendCouponDto } from '../dto/mall-input.dto';
import { MallCouponResponseDto, MallCouponListResponseDto, MallCouponUserResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 营销优惠')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/coupon')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Get()
  @RequirePermissions('mall:coupon:query')
  @ApiOperation({ summary: '分页查询优惠券模板列表' })
  @ApiOkResponse({ type: MallCouponListResponseDto })
  async findAll(@Query() query: CouponQueryDto) {
    return this.promotionService.findAll(query);
  }

  @Get('user-list')
  @RequirePermissions('mall:coupon:query')
  @ApiOperation({ summary: '查询会员持有的优惠券列表' })
  @ApiOkResponse({ type: MallCouponUserResponseDto, isArray: true })
  async findAllUserCoupons(@Query('memberId') memberId?: string) {
    return this.promotionService.findAllUserCoupons(memberId ? Number(memberId) : undefined);
  }

  @Get(':id')
  @RequirePermissions('mall:coupon:query')
  @ApiOperation({ summary: '根据 ID 获取优惠券模板详情' })
  @ApiOkResponse({ type: MallCouponResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.findOne(id);
  }

  @Post()
  @RequirePermissions('mall:coupon:create')
  @Log({ module: '营销管理', type: 'CREATE', description: '创建优惠券模板' })
  @ApiOperation({ summary: '创建优惠券模板' })
  @ApiOkResponse({ type: MallCouponResponseDto })
  async create(@Body() data: CreateMallCouponDto) {
    return this.promotionService.create(data);
  }

  @Put(':id/status')
  @RequirePermissions('mall:coupon:update')
  @Log({
    module: '营销管理',
    type: 'UPDATE',
    description: '更新优惠券模板状态',
  })
  @ApiOperation({ summary: '启用或禁用优惠券模板' })
  @ApiOkResponse({ type: MallCouponResponseDto })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMallCouponStatusDto,
  ) {
    return this.promotionService.updateStatus(id, data.status);
  }

  @Post(':id/send')
  @RequirePermissions('mall:coupon:update')
  @Log({ module: '营销管理', type: 'CREATE', description: '分发优惠券给会员' })
  @ApiOperation({ summary: '手动批量分发优惠券给指定会员' })
  @ApiOkResponse({ type: Boolean })
  async sendCoupon(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: SendCouponDto,
  ) {
    return this.promotionService.sendCoupon(id, data.memberIds);
  }

  @Delete(':id')
  @RequirePermissions('mall:coupon:delete')
  @Log({ module: '营销管理', type: 'DELETE', description: '删除优惠券模板' })
  @ApiOperation({ summary: '删除优惠券模板' })
  @ApiOkResponse({ type: MallCouponResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.remove(id);
  }
}

