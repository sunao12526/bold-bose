import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MpClientService {
  private readonly logger = new Logger(MpClientService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: any
  ) {}

  /**
   * 获取微信公众号的 AccessToken (带缓存机制)
   */
  async getAccessToken(appId: string): Promise<string> {
    const cacheKey = `mp:token:${appId}`;
    const cachedToken = await this.cacheManager.get(cacheKey) as string;
    if (cachedToken) {
      return cachedToken;
    }

    // 从数据库中查 appSecret
    const account = await this.prisma.mpAccount.findUnique({ where: { appId } });
    if (!account) {
      throw new BadRequestException(`未找到 AppId 对应的公众号账号配置: ${appId}`);
    }

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${account.appSecret}`;
    const res = await fetch(url);
    const data = await res.json() as any;

    if (data.errcode) {
      this.logger.error(`获取 AccessToken 失败: ${JSON.stringify(data)}`);
      throw new BadRequestException(`微信公众平台返回错误: ${data.errmsg} (${data.errcode})`);
    }

    const token = data.access_token;
    // 缓存过期时间略微扣除 200 秒以保安全
    const ttl = (data.expires_in - 200) * 1000;
    await this.cacheManager.set(cacheKey, token, ttl);

    return token;
  }

  /**
   * 清除微信 AccessToken 缓存
   */
  async clearTokenCache(appId: string): Promise<void> {
    await this.cacheManager.del(`mp:token:${appId}`);
  }

  /**
   * 通用微信 API 请求封装
   */
  async request(
    appId: string,
    method: 'GET' | 'POST',
    path: string,
    options?: { query?: Record<string, string>; body?: any; isUpload?: boolean }
  ): Promise<any> {
    const token = await this.getAccessToken(appId);
    let url = `https://api.weixin.qq.com${path}`;
    
    // 拼装 query 参数，默认带上 access_token
    const queryParams = new URLSearchParams(options?.query || {});
    queryParams.set('access_token', token);
    url += `?${queryParams.toString()}`;

    const headers: Record<string, string> = {};
    let reqBody: any = undefined;

    if (method === 'POST') {
      if (options?.isUpload) {
        // 上传文件时，外部直接构造好 FormData 传入，不需要设 Content-Type
        reqBody = options.body;
      } else {
        headers['Content-Type'] = 'application/json';
        reqBody = JSON.stringify(options?.body || {});
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: reqBody,
    });

    const text = await response.text();
    let resData: any;
    try {
      resData = JSON.parse(text);
    } catch {
      // 微信可能直接返回文件流，此时直接解析成 Buffer 或返回文本
      return text;
    }

    // 微信全局错误码判断 (errcode = 0 表示成功)
    if (resData.errcode && resData.errcode !== 0) {
      this.logger.warn(`微信接口调用失败 [${path}]: ${text}`);
      
      // 如果是 token 失效 (40001 / 42001)，则清空缓存以便下次重试
      if (resData.errcode === 40001 || resData.errcode === 42001) {
        await this.clearTokenCache(appId);
      }
      throw new BadRequestException(`微信返回错误: ${resData.errmsg} (${resData.errcode})`);
    }

    return resData;
  }

  // ==================== 标签管理 API ====================

  async createTag(appId: string, name: string): Promise<{ id: number; name: string }> {
    const res = await this.request(appId, 'POST', '/cgi-bin/tags/create', {
      body: { tag: { name } },
    });
    return res.tag;
  }

  async updateTag(appId: string, tagId: number, name: string): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/tags/update', {
      body: { tag: { id: tagId, name } },
    });
  }

  async deleteTag(appId: string, tagId: number): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/tags/delete', {
      body: { tag: { id: tagId } },
    });
  }

  async getTags(appId: string): Promise<Array<{ id: number; name: string; count: number }>> {
    const res = await this.request(appId, 'GET', '/cgi-bin/tags/get');
    return res.tags || [];
  }

  async batchTagging(appId: string, openidList: string[], tagId: number): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/tags/members/batchtagging', {
      body: { openid_list: openidList, tagid: tagId },
    });
  }

  async batchUntagging(appId: string, openidList: string[], tagId: number): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/tags/members/batchuntagging', {
      body: { openid_list: openidList, tagid: tagId },
    });
  }

  // ==================== 粉丝用户管理 API ====================

  async getFollowers(appId: string, nextOpenid = ''): Promise<{ openids: string[]; nextOpenid: string; total: number }> {
    const res = await this.request(appId, 'GET', '/cgi-bin/user/get', {
      query: nextOpenid ? { next_openid: nextOpenid } : undefined,
    });
    return {
      openids: res.data?.openid || [],
      nextOpenid: res.next_openid || '',
      total: res.total || 0,
    };
  }

  async getUserInfoBatch(appId: string, openids: string[]): Promise<any[]> {
    if (!openids || openids.length === 0) return [];
    const userList = openids.map(openid => ({ openid, lang: 'zh_CN' }));
    const res = await this.request(appId, 'POST', '/cgi-bin/user/info/batchget', {
      body: { user_list: userList },
    });
    return res.user_info_list || [];
  }

  async updateRemark(appId: string, openid: string, remark: string): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/user/info/updateremark', {
      body: { openid, remark },
    });
  }

  // ==================== 自定义菜单 API ====================

  async publishMenu(appId: string, menuJson: any): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/menu/create', {
      body: menuJson,
    });
  }

  async deleteMenu(appId: string): Promise<void> {
    await this.request(appId, 'GET', '/cgi-bin/menu/delete');
  }

  async getMenu(appId: string): Promise<any> {
    return this.request(appId, 'GET', '/cgi-bin/menu/get');
  }

  // ==================== 客服消息 API ====================

  async sendKefuMessage(appId: string, openid: string, msgType: string, content: any): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/message/custom/send', {
      body: {
        touser: openid,
        msgtype: msgType,
        ...content,
      },
    });
  }

  // ==================== 二维码 / API 额度 ====================

  async createQrCode(appId: string, sceneStr: string, expireSeconds = 2592000): Promise<{ ticket: string; url: string }> {
    const res = await this.request(appId, 'POST', '/cgi-bin/qrcode/create', {
      body: {
        expire_seconds: expireSeconds,
        action_name: 'QR_STR_SCENE',
        action_info: { scene: { scene_str: sceneStr } },
      },
    });
    return {
      ticket: res.ticket,
      url: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(res.ticket)}`,
    };
  }

  async clearQuota(appId: string): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/clear_quota', {
      body: { appid: appId },
    });
  }

  // ==================== 模板消息 API ====================

  async getPrivateTemplates(appId: string): Promise<any[]> {
    const res = await this.request(appId, 'GET', '/cgi-bin/template/get_all_private_template');
    return res.template_list || [];
  }

  async sendTemplateMessage(appId: string, openid: string, templateId: string, data: any, url?: string, miniprogram?: any): Promise<number> {
    const res = await this.request(appId, 'POST', '/cgi-bin/message/template/send', {
      body: {
        touser: openid,
        template_id: templateId,
        url,
        miniprogram,
        data,
      },
    });
    return res.msgid;
  }

  // ==================== 临时/永久素材上传 API ====================

  async uploadTemporaryMaterial(appId: string, type: string, fileBuffer: Buffer, fileName: string): Promise<{ media_id: string; url?: string }> {
    const formData = new FormData();
    const blob = new Blob([fileBuffer as any]);
    formData.append('media', blob, fileName);

    const res = await this.request(appId, 'POST', `/cgi-bin/media/upload`, {
      query: { type },
      body: formData,
      isUpload: true,
    });
    return { media_id: res.media_id, url: res.url };
  }

  async uploadPermanentMaterial(appId: string, type: string, fileBuffer: Buffer, fileName: string, title?: string, introduction?: string): Promise<{ media_id: string; url: string }> {
    const formData = new FormData();
    const blob = new Blob([fileBuffer as any]);
    formData.append('media', blob, fileName);

    if (type === 'video') {
      formData.append('description', JSON.stringify({ title, introduction }));
    }

    const res = await this.request(appId, 'POST', `/cgi-bin/material/add_material`, {
      query: { type },
      body: formData,
      isUpload: true,
    });
    return { media_id: res.media_id, url: res.url };
  }

  async deletePermanentMaterial(appId: string, mediaId: string): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/material/del_material', {
      body: { media_id: mediaId },
    });
  }

  // ==================== 草稿箱 API ====================

  async addDraft(appId: string, articles: any[]): Promise<{ media_id: string }> {
    const res = await this.request(appId, 'POST', '/cgi-bin/draft/add', {
      body: { articles },
    });
    return { media_id: res.media_id };
  }

  async getDrafts(appId: string, offset = 0, count = 20): Promise<{ item: any[]; total_count: number }> {
    const res = await this.request(appId, 'POST', '/cgi-bin/draft/batchget', {
      body: { offset, count, no_content: 0 },
    });
    return { item: res.item || [], total_count: res.total_count || 0 };
  }

  async deleteDraft(appId: string, mediaId: string): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/draft/delete', {
      body: { media_id: mediaId },
    });
  }

  // ==================== 发表记录 API ====================

  async publishDraft(appId: string, mediaId: string): Promise<{ publish_id: string }> {
    const res = await this.request(appId, 'POST', '/cgi-bin/freesublish/submit', {
      body: { media_id: mediaId },
    });
    return { publish_id: res.publish_id };
  }

  async getFreePublishList(appId: string, offset = 0, count = 20): Promise<{ item: any[]; total_count: number }> {
    const res = await this.request(appId, 'POST', '/cgi-bin/freesublish/batchget', {
      body: { offset, count, no_content: 0 },
    });
    return { item: res.item || [], total_count: res.total_count || 0 };
  }

  async deleteFreePublish(appId: string, articleId: string): Promise<void> {
    await this.request(appId, 'POST', '/cgi-bin/freesublish/delete', {
      body: { article_id: articleId },
    });
  }
}
