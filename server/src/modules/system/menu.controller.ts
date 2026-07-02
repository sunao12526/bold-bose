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
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu-input.dto';
import { MenuResponseDto } from './dto/menu-response.dto';

@ApiTags('系统 - 菜单管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  @RequirePermissions('system:menu:create')
  @Log({ module: '菜单管理', type: 'CREATE', description: '创建菜单' })
  @ApiOperation({ summary: '创建菜单' })
  @ApiOkResponse({ type: MenuResponseDto })
  async create(@Body() data: CreateMenuDto) {
    return this.menuService.create(data);
  }

  @Get()
  @RequirePermissions('system:menu:query')
  @ApiOperation({ summary: '获取所有菜单列表' })
  @ApiOkResponse({ type: MenuResponseDto, isArray: true })
  async findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @RequirePermissions('system:menu:query')
  @ApiOperation({ summary: '根据 ID 获取菜单详情' })
  @ApiOkResponse({ type: MenuResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:menu:update')
  @Log({ module: '菜单管理', type: 'UPDATE', description: '修改菜单' })
  @ApiOperation({ summary: '修改菜单' })
  @ApiOkResponse({ type: MenuResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMenuDto) {
    return this.menuService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:menu:delete')
  @Log({ module: '菜单管理', type: 'DELETE', description: '删除菜单' })
  @ApiOperation({ summary: '删除菜单' })
  @ApiOkResponse({ type: MenuResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}

