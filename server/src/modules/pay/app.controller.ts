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
import { PayAppService } from './app.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreatePayAppDto, UpdatePayAppDto } from './dto/pay-input.dto';
import { PayAppResponseDto } from './dto/pay-response.dto';

@ApiTags('支付中心 - 支付应用')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pay/app')
export class PayAppController {
  constructor(private appService: PayAppService) {}

  @Post()
  @RequirePermissions('pay:app:create')
  @Log({ module: '支付应用', type: 'CREATE', description: '创建支付应用' })
  @ApiOperation({ summary: '创建支付应用' })
  @ApiOkResponse({ type: PayAppResponseDto })
  async create(
    @Body() data: CreatePayAppDto,
  ) {
    return this.appService.create(data);
  }

  @Get()
  @RequirePermissions('pay:app:query')
  @ApiOperation({ summary: '获取全部支付应用列表' })
  @ApiOkResponse({ type: PayAppResponseDto, isArray: true })
  async findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  @RequirePermissions('pay:app:query')
  @ApiOperation({ summary: '根据 ID 获取支付应用详情' })
  @ApiOkResponse({ type: PayAppResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('pay:app:update')
  @Log({ module: '支付应用', type: 'UPDATE', description: '更新支付应用' })
  @ApiOperation({ summary: '修改支付应用信息' })
  @ApiOkResponse({ type: PayAppResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePayAppDto,
  ) {
    return this.appService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('pay:app:delete')
  @Log({ module: '支付应用', type: 'DELETE', description: '删除支付应用' })
  @ApiOperation({ summary: '删除支付应用' })
  @ApiOkResponse({ type: PayAppResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.appService.remove(id);
  }
}

