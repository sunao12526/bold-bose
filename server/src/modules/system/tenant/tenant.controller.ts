import {
  BadRequestException,
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
import { Public } from '../../../shared/decorators/public.decorator';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import {
  CreateTenantDto,
  TenantQueryDto,
  UpdateTenantDto,
} from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('系统 - 租户管理')
@Controller('system/tenant')
export class TenantController {
  constructor(private readonly service: TenantService) {}

  @Public()
  @Get('get-id-by-name')
  @ApiOperation({ summary: '根据租户名称获取租户编号' })
  async getIdByName(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('name 参数不能为空');
    }
    return this.service.getIdByName(name);
  }

  @Public()
  @Get('get-by-website')
  @ApiOperation({ summary: '根据域名获取租户信息' })
  async getByWebsite(@Query('website') website: string) {
    if (!website) {
      throw new BadRequestException('website 参数不能为空');
    }
    return this.service.getByWebsite(website);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @RequirePermissions('system:tenant:query')
  @ApiOperation({ summary: '分页查询租户列表' })
  async findAll(@Query() query: TenantQueryDto) {
    return this.service.findAll(query);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get(':id')
  @RequirePermissions('system:tenant:query')
  @ApiOperation({ summary: '获取租户详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Post()
  @RequirePermissions('system:tenant:create')
  @Log({ module: '租户管理', type: 'CREATE', description: '创建租户' })
  @ApiOperation({ summary: '创建租户' })
  async create(@Body() body: CreateTenantDto) {
    return this.service.create(body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Put(':id')
  @RequirePermissions('system:tenant:update')
  @Log({ module: '租户管理', type: 'UPDATE', description: '更新租户' })
  @ApiOperation({ summary: '更新租户' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTenantDto,
  ) {
    return this.service.update(id, body);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete(':id')
  @RequirePermissions('system:tenant:delete')
  @Log({ module: '租户管理', type: 'DELETE', description: '删除租户' })
  @ApiOperation({ summary: '删除租户' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
