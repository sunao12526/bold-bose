import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MpUserService } from './mp-user.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/user')
export class MpUserController {
  constructor(private service: MpUserService) {}

  @Get()
  @RequirePermissions('mp:user:query')
  async findAll(@Query() query: any) { return this.service.findAll(query); }

  @Get(':id')
  @RequirePermissions('mp:user:query')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
}
