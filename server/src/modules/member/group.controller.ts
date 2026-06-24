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
import { GroupService } from './group.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @RequirePermissions('member:group:query')
  async findAll(@Query() query: any) {
    return this.groupService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('member:group:query')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:group:create')
  @Log({ module: '会员分组', type: 'CREATE', description: '创建会员分组' })
  async create(@Body() data: any) {
    return this.groupService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:group:update')
  @Log({ module: '会员分组', type: 'UPDATE', description: '更新会员分组' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.groupService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:group:delete')
  @Log({ module: '会员分组', type: 'DELETE', description: '删除会员分组' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.remove(id);
  }
}
