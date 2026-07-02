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
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../shared/decorators/require-permissions.decorator';
import { Log } from '../../shared/decorators/log.decorator';
import { CreateAddressDto, UpdateAddressDto, SignInRecordQueryDto } from './dto/member-input.dto';
import { MemberAddressResponseDto } from './dto/member-response.dto';

@ApiTags('会员 - 收货地址')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('member/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  @RequirePermissions('member:user:query')
  @ApiOperation({ summary: '根据会员 ID 查询收货地址列表' })
  @ApiOkResponse({ type: MemberAddressResponseDto, isArray: true })
  async findAll(@Query() query: SignInRecordQueryDto) {
    return this.addressService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('member:user:query')
  @ApiOperation({ summary: '根据 ID 获取收货地址详情' })
  @ApiOkResponse({ type: MemberAddressResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findOne(id);
  }

  @Post()
  @RequirePermissions('member:user:update')
  @Log({ module: '会员收货地址', type: 'CREATE', description: '添加收货地址' })
  @ApiOperation({ summary: '添加收货地址' })
  @ApiOkResponse({ type: MemberAddressResponseDto })
  async create(@Body() data: CreateAddressDto) {
    return this.addressService.create(data);
  }

  @Put(':id')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员收货地址', type: 'UPDATE', description: '修改收货地址' })
  @ApiOperation({ summary: '修改收货地址' })
  @ApiOkResponse({ type: MemberAddressResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateAddressDto) {
    return this.addressService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('member:user:update')
  @Log({ module: '会员收货地址', type: 'DELETE', description: '删除收货地址' })
  @ApiOperation({ summary: '删除收货地址' })
  @ApiOkResponse({ type: MemberAddressResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id);
  }
}

