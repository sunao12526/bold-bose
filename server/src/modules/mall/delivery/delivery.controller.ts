import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { PaginationQuerySchema } from '../../../shared/dto/pagination.dto';
import { DeliveryService } from './delivery.service';

export const ExpressQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  code: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class ExpressQueryDto extends createZodDto(ExpressQuerySchema) {}

export const CreateExpressSchema = z.object({
  code: z.string().min(1).max(64),
  name: z.string().min(1).max(100),
  logo: z.string().max(512).nullable().optional(),
  sort: z.coerce.number().int().optional().default(0),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
});
export class CreateExpressDto extends createZodDto(CreateExpressSchema) {}

export const UpdateExpressSchema = CreateExpressSchema.partial();
export class UpdateExpressDto extends createZodDto(UpdateExpressSchema) {}

export const DeliveryTemplateQuerySchema = PaginationQuerySchema.extend({
  name: z.string().optional(),
  status: z.enum(CommonStatus).optional(),
});
export class DeliveryTemplateQueryDto extends createZodDto(DeliveryTemplateQuerySchema) {}

export const CreateDeliveryTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  chargeMode: z.coerce.number().int().optional().default(1),
  sort: z.coerce.number().int().optional().default(0),
  basePrice: z.coerce.number().int().min(0),
  extraPrice: z.coerce.number().int().min(0),
  freePrice: z.coerce.number().int().min(0).nullable().optional(),
  status: z.enum(CommonStatus).optional().default('ENABLE'),
});
export class CreateDeliveryTemplateDto extends createZodDto(CreateDeliveryTemplateSchema) {}

export const UpdateDeliveryTemplateSchema = CreateDeliveryTemplateSchema.partial();
export class UpdateDeliveryTemplateDto extends createZodDto(UpdateDeliveryTemplateSchema) {}

@ApiTags('商城中心 - 物流公司')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/delivery/express')
export class DeliveryExpressController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('simple-list')
  @ApiOperation({ summary: '获取启用的物流公司精简列表' })
  async simpleList() {
    return this.deliveryService.findSimpleExpressList();
  }

  @Get()
  @RequirePermissions('mall:delivery:query')
  @ApiOperation({ summary: '分页查询物流公司' })
  async findAll(@Query() query: ExpressQueryDto) {
    return this.deliveryService.findAllExpress(query);
  }

  @Post()
  @RequirePermissions('mall:delivery:create')
  @Log({ module: '物流公司', type: 'CREATE', description: '创建物流公司' })
  @ApiOperation({ summary: '创建物流公司' })
  async create(@Body() body: CreateExpressDto) {
    return this.deliveryService.createExpress(body);
  }

  @Put(':id')
  @RequirePermissions('mall:delivery:update')
  @Log({ module: '物流公司', type: 'UPDATE', description: '更新物流公司' })
  @ApiOperation({ summary: '更新物流公司' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateExpressDto,
  ) {
    return this.deliveryService.updateExpress(id, body);
  }

  @Delete(':id')
  @RequirePermissions('mall:delivery:delete')
  @Log({ module: '物流公司', type: 'DELETE', description: '删除物流公司' })
  @ApiOperation({ summary: '删除物流公司' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deliveryService.removeExpress(id);
  }
}

@ApiTags('商城中心 - 运费模板')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/delivery/express-template')
export class DeliveryTemplateController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @RequirePermissions('mall:delivery:query')
  @ApiOperation({ summary: '分页查询运费模板' })
  async findAll(@Query() query: DeliveryTemplateQueryDto) {
    return this.deliveryService.findAllTemplates(query);
  }

  @Post()
  @RequirePermissions('mall:delivery:create')
  @Log({ module: '运费模板', type: 'CREATE', description: '创建运费模板' })
  @ApiOperation({ summary: '创建运费模板' })
  async create(@Body() body: CreateDeliveryTemplateDto) {
    return this.deliveryService.createTemplate(body);
  }

  @Put(':id')
  @RequirePermissions('mall:delivery:update')
  @Log({ module: '运费模板', type: 'UPDATE', description: '更新运费模板' })
  @ApiOperation({ summary: '更新运费模板' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDeliveryTemplateDto,
  ) {
    return this.deliveryService.updateTemplate(id, body);
  }

  @Delete(':id')
  @RequirePermissions('mall:delivery:delete')
  @Log({ module: '运费模板', type: 'DELETE', description: '删除运费模板' })
  @ApiOperation({ summary: '删除运费模板' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deliveryService.removeTemplate(id);
  }
}
