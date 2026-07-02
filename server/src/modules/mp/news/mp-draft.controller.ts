import { Controller, Get, Post, Delete, Body, Query, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../shared/guards/permissions.guard';
import { RequirePermissions } from '../../../shared/decorators/require-permissions.decorator';
import { Log } from '../../../shared/decorators/log.decorator';

@ApiTags('微信公众号 - 草稿箱')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mp/draft')
export class MpDraftController {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  @Get('page')
  @RequirePermissions('mp:draft:query')
  @ApiOperation({ summary: '分页查询草稿箱列表' })
  async getDraftPage(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('page', ParseIntPipe) page = 1,
    @Query('size', ParseIntPipe) size = 10
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    const offset = (page - 1) * size;
    const res = await this.mpClient.getDrafts(account.appId, offset, size);
    return {
      data: {
        list: res.item,
        total: res.total_count,
      }
    };
  }

  @Post('create')
  @RequirePermissions('mp:draft:create')
  @Log({ module: '草稿箱', type: 'CREATE', description: '创建草稿' })
  @ApiOperation({ summary: '创建微信多图文草稿' })
  async createDraft(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Body() body: { articles: any[] }
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    const result = await this.mpClient.addDraft(account.appId, body.articles);
    return { data: result };
  }

  @Post('publish')
  @RequirePermissions('mp:draft:publish')
  @Log({ module: '草稿箱', type: 'UPDATE', description: '发布草稿' })
  @ApiOperation({ summary: '一键发表草稿箱图文' })
  async publishDraft(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Body() body: { mediaId: string }
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    const result = await this.mpClient.publishDraft(account.appId, body.mediaId);
    return { data: result };
  }

  @Delete('delete')
  @RequirePermissions('mp:draft:delete')
  @Log({ module: '草稿箱', type: 'DELETE', description: '删除草稿' })
  @ApiOperation({ summary: '删除微信草稿' })
  async deleteDraft(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('mediaId') mediaId: string
  ) {
    const account = await this.prisma.mpAccount.findUnique({ where: { id: accountId } });
    if (!account) throw new NotFoundException('公众号不存在');

    await this.mpClient.deleteDraft(account.appId, mediaId);
    return { data: true };
  }
}
