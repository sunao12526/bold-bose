import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';

@Injectable()
export class MpMenuService {
  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  async create(data: any) {
    return this.prisma.mpMenu.create({ data });
  }

  async findAll(query?: any) {
    const where: any = {};
    if (query?.accountId) where.accountId = Number(query.accountId);
    return this.prisma.mpMenu.findMany({ where, orderBy: { sort: 'asc' } });
  }

  async findOne(id: number) {
    const record = await this.prisma.mpMenu.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('菜单不存在');
    return record;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.mpMenu.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mpMenu.delete({ where: { id } });
  }

  /**
   * 将本地公众号自定义菜单同步发布至微信服务器
   */
  async publishMenu(accountId: number): Promise<void> {
    const account = await this.prisma.mpAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('微信公众号账号不存在');

    // 1. 获取本地全部菜单项
    const dbMenus = await this.prisma.mpMenu.findMany({
      where: { accountId },
      orderBy: { sort: 'asc' },
    });

    // 2. 组合为微信所需的 button 树形结构
    const parentMenus = dbMenus.filter(m => !m.parentId || m.parentId === 0);
    const buttons = parentMenus.map(parent => {
      const subDbMenus = dbMenus.filter(m => m.parentId === parent.id);

      if (subDbMenus.length > 0) {
        // 存在二级菜单，一级菜单仅做包装，不能配 type/url 等
        return {
          name: parent.name,
          sub_button: subDbMenus.map(sub => this.formatWechatMenuButton(sub)),
        };
      } else {
        // 无二级菜单，直接格式化一级菜单
        return this.formatWechatMenuButton(parent);
      }
    });

    // 3. 推送下发到微信
    await this.mpClient.publishMenu(account.appId, { button: buttons });
  }

  /**
   * 从微信服务器同步拉取当前配置的菜单到本地数据库
   */
  async syncMenu(accountId: number): Promise<void> {
    const account = await this.prisma.mpAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('微信公众号账号不存在');

    // 1. 拉取云端菜单配置
    const wxMenuResult = await this.mpClient.getMenu(account.appId);
    const wxMenu = wxMenuResult?.menu;
    if (!wxMenu || !wxMenu.button) {
      throw new BadRequestException('微信云端未设置菜单配置，同步终止。');
    }

    // 2. 扁平化还原为本地数据项并清空重写
    await this.prisma.$transaction(async (tx) => {
      // 级联清空本地该公众号的菜单记录
      await tx.mpMenu.deleteMany({ where: { accountId } });

      let sort = 1;
      for (const btn of wxMenu.button) {
        // 创建一级菜单
        const parentMenu = await tx.mpMenu.create({
          data: {
            accountId,
            appId: account.appId,
            name: btn.name,
            type: btn.type ? btn.type.toUpperCase() : null,
            menuKey: btn.key || null,
            url: btn.url || null,
            miniProgramAppId: btn.appid || null,
            miniProgramPagePath: btn.pagepath || null,
            sort: sort++,
          },
        });

        // 写入二级菜单 (如果有)
        if (btn.sub_button && btn.sub_button.list) {
          let subSort = 1;
          for (const subBtn of btn.sub_button.list) {
            await tx.mpMenu.create({
              data: {
                accountId,
                appId: account.appId,
                name: subBtn.name,
                parentId: parentMenu.id,
                type: subBtn.type ? subBtn.type.toUpperCase() : null,
                menuKey: subBtn.key || null,
                url: subBtn.url || null,
                miniProgramAppId: subBtn.appid || null,
                miniProgramPagePath: subBtn.pagepath || null,
                sort: subSort++,
              },
            });
          }
        }
      }
    });
  }

  /**
   * 将本地菜单项转化为微信官方的按钮节点结构
   */
  private formatWechatMenuButton(menu: any) {
    const type = menu.type ? menu.type.toLowerCase() : 'view';
    const btn: any = {
      type,
      name: menu.name,
    };

    if (type === 'view') {
      btn.url = menu.url;
    } else if (type === 'click') {
      btn.key = menu.menuKey || `menu_${menu.id}`;
    } else if (type === 'miniprogram') {
      btn.url = menu.url;
      btn.appid = menu.miniProgramAppId;
      btn.pagepath = menu.miniProgramPagePath;
    }

    return btn;
  }
}
