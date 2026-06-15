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
import { DictTypeService } from './dict-type.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/dict-type')
export class DictTypeController {
  constructor(private dictTypeService: DictTypeService) {}

  @Post()
  @RequirePermissions('system:dict:create')
  async create(@Body() data: any) {
    return this.dictTypeService.create(data);
  }

  @Get()
  @RequirePermissions('system:dict:query')
  async findAll() {
    return this.dictTypeService.findAll();
  }

  @Get(':id')
  @RequirePermissions('system:dict:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dictTypeService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:dict:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dictTypeService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:dict:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.dictTypeService.remove(id);
  }
}
