import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
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
import { Keep } from '../../shared/decorators/keep.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { ExcelService } from '../../shared/excel/excel.service';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserDto, UpdateUserDto, AssignUserRolesDto } from './dto/user-input.dto';
import { UserResponseDto, UserListResponseDto } from './dto/user-response.dto';
import { SuccessResponseDto } from '../../shared/dto/success-response.dto';

@ApiTags('系统 - 用户管理')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system/user')
export class UserController {
  constructor(
    private userService: UserService,
    private excelService: ExcelService,
  ) {}

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
  async findAll(@Query() query: UserQueryDto, @Req() req: any) {
    return this.userService.findAll(query, req.user?.id);
  }

  @Get('export-excel')
  @Keep()
  @RequirePermissions('system:user:export')
  @ApiOperation({ summary: '导出系统用户 Excel' })
  async exportExcel(
    @Query() query: UserQueryDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const rows = await this.userService.findAllForExport(query, req.user?.id);
    this.excelService.sendExcelResponse(
      res,
      '系统用户.xlsx',
      rows,
      [
        { header: '用户编号', key: 'id', width: 10 },
        { header: '用户名', key: 'username', width: 18 },
        { header: '用户昵称', key: 'nickname', width: 18 },
        {
          header: '部门',
          key: 'dept',
          width: 18,
          formatter: (r) => r.dept?.name || '',
        },
        { header: '邮箱', key: 'email', width: 24 },
        { header: '手机号', key: 'mobile', width: 16 },
        {
          header: '状态',
          key: 'status',
          width: 10,
          formatter: (r) => (r.status === 'ENABLE' ? '启用' : '禁用'),
        },
        { header: '创建时间', key: 'createdAt', width: 22 },
      ],
      '用户列表',
    );
  }

  @Get('get-import-template')
  @Keep()
  @RequirePermissions('system:user:import')
  @ApiOperation({ summary: '下载系统用户导入模板' })
  async getImportTemplate(@Res() res: Response) {
    const sampleRows = [
      {
        username: 'demo_user',
        nickname: '示例用户',
        email: 'demo@example.com',
        mobile: '13800138000',
        status: '启用',
        remark: '导入示例（默认密码 123456）',
      },
    ];
    this.excelService.sendExcelResponse(
      res,
      '用户导入模板.xlsx',
      sampleRows,
      [
        { header: '用户名', key: 'username', width: 18 },
        { header: '用户昵称', key: 'nickname', width: 18 },
        { header: '邮箱', key: 'email', width: 24 },
        { header: '手机号', key: 'mobile', width: 16 },
        { header: '状态', key: 'status', width: 10 },
        { header: '备注', key: 'remark', width: 28 },
      ],
      '导入模板',
    );
  }

  @Post('import-excel')
  @RequirePermissions('system:user:import')
  @UseInterceptors(FileInterceptor('file'))
  @Log({ module: '用户管理', type: 'IMPORT', description: '导入系统用户' })
  @ApiOperation({ summary: '导入系统用户 Excel' })
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Query('updateSupport') updateSupport?: string,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('请上传有效的 Excel 文件');
    }
    const rows = this.excelService.parseExcelBuffer(file.buffer);
    return this.userService.importUsers(rows, updateSupport === 'true');
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

