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
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import {
  CreateTenantPackageDto,
  TenantPackageQueryDto,
  UpdateTenantPackageDto,
} from './dto/tenant.dto';
import { TenantPackageService } from './tenant-package.service';

@ApiTags('系统 - 租户套餐')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/tenant-package')
export class TenantPackageController {
  constructor(private readonly service: TenantPackageService) {}

  @Get('simple-list')
  @ApiOperation({ summary: '获取启用的租户套餐精简列表' })
  async getSimpleList() {
    return this.service.findSimpleList();
  }

  @Get()
  @RequirePermissions('system:tenant-package:query')
  @ApiOperation({ summary: '分页查询租户套餐列表' })
  async findAll(@Query() query: TenantPackageQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:tenant-package:query')
  @ApiOperation({ summary: '获取租户套餐详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions('system:tenant-package:create')
  @Log({ module: '租户套餐', type: 'CREATE', description: '创建租户套餐' })
  @ApiOperation({ summary: '创建租户套餐' })
  async create(@Body() body: CreateTenantPackageDto) {
    return this.service.create(body);
  }

  @Put(':id')
  @RequirePermissions('system:tenant-package:update')
  @Log({ module: '租户套餐', type: 'UPDATE', description: '更新租户套餐' })
  @ApiOperation({ summary: '更新租户套餐' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTenantPackageDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @RequirePermissions('system:tenant-package:delete')
  @Log({ module: '租户套餐', type: 'DELETE', description: '删除租户套餐' })
  @ApiOperation({ summary: '删除租户套餐' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
