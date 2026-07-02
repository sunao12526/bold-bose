import { Controller, Get, Delete, Query, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@ApiTags('微信公众号 - 发表记录')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/free-publish')
export class MpFreePublishController {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  @Get('page')
  @RequirePermissions('mp:free-publish:query')
  @ApiOperation({ summary: '分页查询已群发的已发表图文列表' })
  async getFreePublishPage(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    const offset = (page - 1) * size;
    const res = await this.mpClient.getFreePublishList(account.appId, offset, size);
    return {
      data: {
        list: res.item,
        total: res.total_count,
      }
    };
  }

  @Delete('delete')
  @RequirePermissions('mp:free-publish:delete')
  @Log({ module: '发表记录', type: 'DELETE', description: '删除/撤回发表' })
  @ApiOperation({ summary: '撤回/删除已发表内容' })
  async deleteFreePublish(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('articleId') articleId: string
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    await this.mpClient.deleteFreePublish(account.appId, articleId);
    return { data: true };
  }
}
