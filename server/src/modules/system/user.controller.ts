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
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserDto, UpdateUserDto, AssignUserRolesDto } from './dto/user-input.dto';
import { UserResponseDto, UserListResponseDto } from './dto/user-response.dto';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';

@ApiTags('系统 - 用户管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @RequirePermissions('system:user:create')
  @Log({ module: '用户管理', type: 'CREATE', description: '创建用户' })
  @ApiOperation({ summary: '创建系统用户' })
  @ApiOkResponse({ type: UserResponseDto })
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  @RequirePermissions('system:user:query')
  @ApiOperation({ summary: '分页查询用户列表' })
  @ApiOkResponse({ type: UserListResponseDto })
  async findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('system:user:query')
  @ApiOperation({ summary: '根据 ID 获取用户详情' })
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('system:user:update')
  @Log({ module: '用户管理', type: 'UPDATE', description: '修改用户' })
  @ApiOperation({ summary: '修改系统用户' })
  @ApiOkResponse({ type: UserResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('system:user:delete')
  @Log({ module: '用户管理', type: 'DELETE', description: '删除用户' })
  @ApiOperation({ summary: '删除系统用户' })
  @ApiOkResponse({ type: UserResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Post(':id/assign-roles')
  @RequirePermissions('system:user:update')
  @Log({ module: '用户管理', type: 'UPDATE', description: '分配用户角色' })
  @ApiOperation({ summary: '分配用户角色' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignUserRolesDto,
  ) {
    return this.userService.assignRoles(id, body.roleIds);
  }
}

