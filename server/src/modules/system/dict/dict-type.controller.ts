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
import { DictTypeService } from './dict-type.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { CreateDictTypeDto, UpdateDictTypeDto } from '../dto/dict-input.dto';
import { DictTypeResponseDto } from '../dto/dict-response.dto';

@ApiTags('系统 - 字典类型')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/dict-type')
export class DictTypeController {
  constructor(private dictTypeService: DictTypeService) {}

  @Post()
  @RequirePermissions('system:dict:create')
  @ApiOperation({ summary: '创建字典类型' })
  @ApiOkResponse({ type: DictTypeResponseDto })
  async create(@Body() data: CreateDictTypeDto) {
    return this.dictTypeService.create(data);
  }

  @Get()
  @RequirePermissions('system:dict:query')
  @ApiOperation({ summary: '获取所有字典类型列表' })
  @ApiOkResponse({ type: DictTypeResponseDto, isArray: true })
  async findAll() {
    return this.dictTypeService.findAll();
  }

  @Get(':id')
  @RequirePermissions('system:dict:query')
  @ApiOperation({ summary: '根据 ID 获取字典类型详情' })
  @ApiOkResponse({ type: DictTypeResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dictTypeService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:dict:update')
  @ApiOperation({ summary: '修改字典类型' })
  @ApiOkResponse({ type: DictTypeResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateDictTypeDto) {
    return this.dictTypeService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:dict:delete')
  @ApiOperation({ summary: '删除字典类型' })
  @ApiOkResponse({ type: DictTypeResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictTypeService.remove(id);
  }
}

