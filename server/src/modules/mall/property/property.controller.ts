import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CreateMallPropertyDto, UpdateMallPropertyDto } from '../dto/mall-input.dto';
import { MallPropertyResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 商品规格')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Post()
  @RequirePermissions('mall:property:create')
  @Log({ module: '商品规格', type: 'CREATE', description: '创建规格属性' })
  @ApiOperation({ summary: '创建规格属性名称' })
  @ApiOkResponse({ type: MallPropertyResponseDto })
  async create(@Body() data: CreateMallPropertyDto) {
    return this.propertyService.create(data);
  }

  @Get()
  @RequirePermissions('mall:property:query')
  @ApiOperation({ summary: '查询所有规格属性列表' })
  @ApiOkResponse({ type: MallPropertyResponseDto, isArray: true })
  async findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  @RequirePermissions('mall:property:query')
  @ApiOperation({ summary: '根据 ID 获取规格属性详情' })
  @ApiOkResponse({ type: MallPropertyResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:property:update')
  @Log({ module: '商品规格', type: 'UPDATE', description: '修改规格属性' })
  @ApiOperation({ summary: '更新规格属性信息' })
  @ApiOkResponse({ type: MallPropertyResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMallPropertyDto) {
    return this.propertyService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:property:delete')
  @Log({ module: '商品规格', type: 'DELETE', description: '删除规格属性' })
  @ApiOperation({ summary: '删除规格属性' })
  @ApiOkResponse({ type: MallPropertyResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.remove(id);
  }
}

