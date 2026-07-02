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
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Public } from '../../../shared/decorators/public.decorator';
import { CreateConfigDto, UpdateConfigDto, ConfigKeyQueryDto } from '../dto/config-input.dto';
import { ConfigResponseDto } from '../dto/config-response.dto';

@ApiTags('系统 - 参数配置')
@Controller('system/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system:config:create')
  @ApiOperation({ summary: '创建参数配置' })
  @ApiOkResponse({ type: ConfigResponseDto })
  async create(@Body() data: CreateConfigDto) {
    return this.configService.create(data);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system:config:query')
  @ApiOperation({ summary: '查询所有参数配置列表' })
  @ApiOkResponse({ type: ConfigResponseDto, isArray: true })
  async findAll() {
    return this.configService.findAll();
  }

  @Get('key')
  @Public()
  @ApiOperation({ summary: '根据键名获取参数配置值' })
  @ApiOkResponse({ type: ConfigResponseDto })
  async findByKey(@Query() query: ConfigKeyQueryDto) {
    return this.configService.findByKey(query.key);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system:config:query')
  @ApiOperation({ summary: '根据 ID 获取参数配置详情' })
  @ApiOkResponse({ type: ConfigResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.configService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system:config:update')
  @ApiOperation({ summary: '修改参数配置' })
  @ApiOkResponse({ type: ConfigResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateConfigDto) {
    return this.configService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system:config:delete')
  @ApiOperation({ summary: '删除参数配置' })
  @ApiOkResponse({ type: ConfigResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.configService.remove(id);
  }
}

