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
  CreateSocialClientDto,
  SocialClientQueryDto,
  UpdateSocialClientDto,
} from './dto/social-manage.dto';
import { SocialService } from './social.service';

@ApiTags('系统 - 社交应用配置')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/social-client')
export class SocialClientController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  @RequirePermissions('system:social-client:query')
  @ApiOperation({ summary: '分页查询社交应用配置' })
  async findAll(@Query() query: SocialClientQueryDto) {
    return this.socialService.findAllClients(query);
  }

  @Get(':id')
  @RequirePermissions('system:social-client:query')
  @ApiOperation({ summary: '获取社交应用配置详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.socialService.findOneClient(id);
  }

  @Post()
  @RequirePermissions('system:social-client:create')
  @Log({ module: '社交应用', type: 'CREATE', description: '创建社交应用配置' })
  @ApiOperation({ summary: '创建社交应用配置' })
  async create(@Body() body: CreateSocialClientDto) {
    return this.socialService.createClient(body);
  }

  @Put(':id')
  @RequirePermissions('system:social-client:update')
  @Log({ module: '社交应用', type: 'UPDATE', description: '修改社交应用配置' })
  @ApiOperation({ summary: '修改社交应用配置' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSocialClientDto,
  ) {
    return this.socialService.updateClient(id, body);
  }

  @Delete(':id')
  @RequirePermissions('system:social-client:delete')
  @Log({ module: '社交应用', type: 'DELETE', description: '删除社交应用配置' })
  @ApiOperation({ summary: '删除社交应用配置' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.socialService.removeClient(id);
  }
}
