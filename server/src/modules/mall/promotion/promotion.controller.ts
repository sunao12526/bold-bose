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
import { PromotionService } from './promotion.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CommonStatus } from '@prisma/client';
import { CouponQueryDto } from './dto/coupon-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/coupon')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Get()
  @RequirePermissions('mall:coupon:query')
  async findAll(@Query() query: CouponQueryDto) {
    return this.promotionService.findAll(query);
  }

  @Get('user-list')
  @RequirePermissions('mall:coupon:query')
  async findAllUserCoupons() {
    return this.promotionService.findAllUserCoupons();
  }

  @Get(':id')
  @RequirePermissions('mall:coupon:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.findOne(id);
  }

  @Post()
  @RequirePermissions('mall:coupon:create')
  @Log({ module: '营销管理', type: 'CREATE', description: '创建优惠券模板' })
  async create(@Body() data: any) {
    return this.promotionService.create(data);
  }

  @Put(':id/status')
  @RequirePermissions('mall:coupon:update')
  @Log({
    module: '营销管理',
    type: 'UPDATE',
    description: '更新优惠券模板状态',
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: CommonStatus,
  ) {
    return this.promotionService.updateStatus(id, status);
  }

  @Post(':id/send')
  @RequirePermissions('mall:coupon:update')
  @Log({ module: '营销管理', type: 'CREATE', description: '分发优惠券给会员' })
  async sendCoupon(
    @Param('id', ParseIntPipe) id: number,
    @Body('memberIds') memberIds: number[],
  ) {
    return this.promotionService.sendCoupon(id, memberIds);
  }

  @Delete(':id')
  @RequirePermissions('mall:coupon:delete')
  @Log({ module: '营销管理', type: 'DELETE', description: '删除优惠券模板' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.promotionService.remove(id);
  }
}
