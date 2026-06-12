import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FileConfigService } from './file-config.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('infra/file-config')
export class FileConfigController {
  constructor(private fileConfigService: FileConfigService) {}

  @Post()
  @RequirePermissions('infra:file-config:create')
  async create(@Body() data: any) {
    return this.fileConfigService.create(data);
  }

  @Get()
  @RequirePermissions('infra:file-config:query')
  async findAll() {
    return this.fileConfigService.findAll();
  }

  @Get(':id')
  @RequirePermissions('infra:file-config:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fileConfigService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('infra:file-config:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.fileConfigService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('infra:file-config:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.fileConfigService.remove(id);
  }

  @Put(':id/set-master')
  @RequirePermissions('infra:file-config:update')
  async setMaster(@Param('id', ParseIntPipe) id: number) {
    return this.fileConfigService.setMaster(id);
  }
}
