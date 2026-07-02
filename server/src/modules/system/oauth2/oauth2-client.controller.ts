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
import { OAuth2Service } from './oauth2.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

import { OAuth2ClientQueryDto } from '../dto/oauth2-client-query.dto';
import { CreateOAuth2ClientDto, UpdateOAuth2ClientDto } from '../dto/oauth2-input.dto';
import { OAuth2ClientResponseDto } from '../dto/oauth2-response.dto';

@ApiTags('系统 - OAuth2 客户端管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/oauth2-client')
export class OAuth2ClientController {
  constructor(private readonly service: OAuth2Service) {}

  @Post()
  @RequirePermissions('system:oauth2:create')
  @Log({
    module: 'system_oauth2_client',
    type: 'CREATE',
    description: '创建 OAuth2 客户端',
  })
  @ApiOperation({ summary: '创建 OAuth2 客户端' })
  @ApiOkResponse({ type: OAuth2ClientResponseDto })
  async create(@Body() data: CreateOAuth2ClientDto) {
    return this.service.createClient(data);
  }

  @Get()
  @RequirePermissions('system:oauth2:query')
  @ApiOperation({ summary: '查询 OAuth2 客户端列表' })
  @ApiOkResponse({ type: OAuth2ClientResponseDto, isArray: true })
  async findAll(@Query() query: OAuth2ClientQueryDto) {
    return this.service.findAllClients(query);
  }

  @Get(':id')
  @RequirePermissions('system:oauth2:query')
  @ApiOperation({ summary: '根据 ID 获取 OAuth2 客户端详情' })
  @ApiOkResponse({ type: OAuth2ClientResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneClient(id);
  }

  @Put(':id')
  @RequirePermissions('system:oauth2:update')
  @Log({
    module: 'system_oauth2_client',
    type: 'UPDATE',
    description: '修改 OAuth2 客户端',
  })
  @ApiOperation({ summary: '修改 OAuth2 客户端' })
  @ApiOkResponse({ type: OAuth2ClientResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateOAuth2ClientDto) {
    return this.service.updateClient(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:oauth2:delete')
  @Log({
    module: 'system_oauth2_client',
    type: 'DELETE',
    description: '删除 OAuth2 客户端',
  })
  @ApiOperation({ summary: '删除 OAuth2 客户端' })
  @ApiOkResponse({ type: OAuth2ClientResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeClient(id);
  }
}

