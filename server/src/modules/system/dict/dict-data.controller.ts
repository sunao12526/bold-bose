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
import { DictDataService } from './dict-data.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/dict-data')
export class DictDataController {
  constructor(private dictDataService: DictDataService) {}

  @Post()
  @RequirePermissions('system:dict:create')
  async create(@Body() data: any) {
    return this.dictDataService.create(data);
  }

  @Get()
  @RequirePermissions('system:dict:query')
  async findAll(
    @Query('dictType') dictType?: string,
    @Query('status') status?: string,
  ) {
    return this.dictDataService.findAll({ dictType, status });
  }

  @Get(':id')
  @RequirePermissions('system:dict:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dictDataService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:dict:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dictDataService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:dict:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictDataService.remove(id);
  }
}
