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
import { ConfigService } from './config.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Public } from '../../../shared/decorators/public.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Post()
  @RequirePermissions('system:config:create')
  async create(@Body() data: any) {
    return this.configService.create(data);
  }

  @Get()
  @RequirePermissions('system:config:query')
  async findAll() {
    return this.configService.findAll();
  }

  @Get('key')
  @Public() // Allow loading system title/logo without auth before login
  async findByKey(@Query('key') key: string) {
    return this.configService.findByKey(key);
  }

  @Get(':id')
  @RequirePermissions('system:config:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.configService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:config:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.configService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:config:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.configService.remove(id);
  }
}
