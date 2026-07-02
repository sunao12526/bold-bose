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
import { SpuService } from './spu.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';
import { CreateSpuDto, UpdateSpuDto, SpuQueryDto } from './dto/spu.dto';
import { SpuResponseDto, SpuListResponseDto } from '../dto/mall-response.dto';

@ApiTags('商城中心 - 商品管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mall/spu')
export class SpuController {
  constructor(private spuService: SpuService) {}

  @Post()
  @RequirePermissions('mall:spu:create')
  @Log({ module: '商品管理', type: 'CREATE', description: '创建商品' })
  @ApiOperation({ summary: '创建商品 SPU（包含 SKU 列表）' })
  @ApiOkResponse({ type: SpuResponseDto })
  async create(@Body() data: CreateSpuDto) {
    return this.spuService.create(data);
  }

  @Get()
  @RequirePermissions('mall:spu:query')
  @ApiOperation({ summary: '分页查询商品 SPU 列表' })
  @ApiOkResponse({ type: SpuListResponseDto })
  async findAll(@Query() query: SpuQueryDto) {
    return this.spuService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('mall:spu:query')
  @ApiOperation({ summary: '根据 ID 获取商品 SPU 详情' })
  @ApiOkResponse({ type: SpuResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spuService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('mall:spu:update')
  @Log({ module: '商品管理', type: 'UPDATE', description: '修改商品' })
  @ApiOperation({ summary: '更新商品 SPU（包含 SKU 列表）' })
  @ApiOkResponse({ type: SpuResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSpuDto) {
    return this.spuService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('mall:spu:delete')
  @Log({ module: '商品管理', type: 'DELETE', description: '删除商品' })
  @ApiOperation({ summary: '删除商品 SPU' })
  @ApiOkResponse({ type: SpuResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.spuService.remove(id);
  }
}

