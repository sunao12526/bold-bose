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
import { DictDataService } from './dict-data.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { CreateDictDataDto, UpdateDictDataDto, DictDataQueryDto } from '../dto/dict-input.dto';
import { DictDataResponseDto } from '../dto/dict-response.dto';

@ApiTags('系统 - 字典数据')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/dict-data')
export class DictDataController {
  constructor(private dictDataService: DictDataService) {}

  @Post()
  @RequirePermissions('system:dict:create')
  @ApiOperation({ summary: '创建字典数据' })
  @ApiOkResponse({ type: DictDataResponseDto })
  async create(@Body() data: CreateDictDataDto) {
    return this.dictDataService.create(data);
  }

  @Get()
  @RequirePermissions('system:dict:query')
  @ApiOperation({ summary: '查询字典数据列表' })
  @ApiOkResponse({ type: DictDataResponseDto, isArray: true })
  async findAll(
    @Query() query: DictDataQueryDto,
  ) {
    return this.dictDataService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:dict:query')
  @ApiOperation({ summary: '根据 ID 获取字典数据详情' })
  @ApiOkResponse({ type: DictDataResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dictDataService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:dict:update')
  @ApiOperation({ summary: '修改字典数据' })
  @ApiOkResponse({ type: DictDataResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateDictDataDto) {
    return this.dictDataService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:dict:delete')
  @ApiOperation({ summary: '删除字典数据' })
  @ApiOkResponse({ type: DictDataResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictDataService.remove(id);
  }
}

