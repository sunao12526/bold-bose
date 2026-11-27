import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../shared/decorators/public.decorator';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AddressService } from '../address.service';
import {
  AppMemberCreateAddressDto,
  AppMemberUpdateAddressDto,
} from './dto/app-member.dto';
import { MemberAuthGuard } from './member-auth.guard';

@ApiTags('C端 - 会员收货地址')
@ApiBearerAuth('JWT-auth')
@Public()
@UseGuards(MemberAuthGuard)
@Controller('app-api/member/address')
export class AppMemberAddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: '获取我的收货地址列表' })
  async list(@Req() req: any) {
    return this.prisma.memberAddress.findMany({
      where: { memberId: req.user.id },
      orderBy: [{ defaultStatus: 'desc' }, { id: 'desc' }],
    });
  }

  @Get('get-default')
  @ApiOperation({ summary: '获取默认收货地址' })
  async getDefault(@Req() req: any) {
    return this.prisma.memberAddress.findFirst({
      where: { memberId: req.user.id, defaultStatus: true },
    });
  }

  @Get('get')
  @ApiOperation({ summary: '获取指定收货地址详情' })
  async get(@Req() req: any, @Query('id') id: string) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new BadRequestException('无效的地址编号');
    }
    const addr = await this.addressService.findOne(parsedId);
    if (addr.memberId !== req.user.id) {
      throw new ForbiddenException('无权访问该收货地址');
    }
    return addr;
  }

  @Post('create')
  @ApiOperation({ summary: '新增收货地址' })
  async create(@Req() req: any, @Body() body: AppMemberCreateAddressDto) {
    return this.addressService.create({
      ...body,
      memberId: req.user.id,
    });
  }

  @Put('update')
  @ApiOperation({ summary: '修改收货地址' })
  async update(@Req() req: any, @Body() body: AppMemberUpdateAddressDto) {
    const addr = await this.addressService.findOne(body.id);
    if (addr.memberId !== req.user.id) {
      throw new ForbiddenException('无权修改该收货地址');
    }
    return this.addressService.update(body.id, body);
  }

  @Delete('delete')
  @ApiOperation({ summary: '删除收货地址' })
  async delete(@Req() req: any, @Query('id') id: string) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new BadRequestException('无效的地址编号');
    }
    const addr = await this.addressService.findOne(parsedId);
    if (addr.memberId !== req.user.id) {
      throw new ForbiddenException('无权删除该收货地址');
    }
    return this.addressService.remove(parsedId);
  }
}
