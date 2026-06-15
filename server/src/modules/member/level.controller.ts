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
import { LevelService } from './level.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/level')
export class LevelController {
  constructor(private levelService: LevelService) {}

  @Get()
  @RequirePermissions('member:level:query')
  async findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  @RequirePermissions('member:level:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:level:create')
  @Log({ module: '会员等级', type: 'CREATE', description: '创建会员等级' })
  async create(@Body() data: any) {
    return this.levelService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:level:update')
  @Log({ module: '会员等级', type: 'UPDATE', description: '更新会员等级' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.levelService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:level:delete')
  @Log({ module: '会员等级', type: 'DELETE', description: '删除会员等级' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.remove(id);
  }
}
