import { Controller, Get, Post, Query, Param, Body, Header, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as xml2js from 'xml2js';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { MpClientService } from '../shared/mp-client.service';
import { WechatCrypto } from '../shared/wechat-crypto';

// 微信 XML 转化 JSON 辅助方法
async function parseXml(xml: string): Promise<any> {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  const result = await parser.parseStringPromise(xml);
  return result.xml;
}

// JSON 构建 XML 辅助方法
function buildXml(obj: any): string {
  const builder = new xml2js.Builder({ rootName: 'xml', cdata: true, headless: true });
  return builder.buildObject(obj);
}

@ApiTags('微信公众号 - 服务器回调')
@Controller('mp/open')
export class MpOpenController {
  private readonly logger = new Logger(MpOpenController.name);

  constructor(
    private prisma: PrismaService,
    private mpClient: MpClientService
  ) {}

  /**
   * 微信服务器接入校验 (GET /mp/open/:appId)
   */
  @Get(':appId')
  @ApiOperation({ summary: '微信服务器接入校验' })
  @Header('Content-Type', 'text/plain;charset=utf-8')
  async verifyUrl(
    @Param('appId') appId: string,
    @Query('signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Query('echostr') echostr: string
  ): Promise<string> {
    this.logger.log(`接收到来自微信服务器的接入校验: appId=${appId}, signature=${signature}, timestamp=${timestamp}, nonce=${nonce}`);

    const account = await this.prisma.mpAccount.findUnique({ where: { appId } });
    if (!account) {
      this.logger.error(`校验失败，公众号账号配置不存在: ${appId}`);
      return '非法请求';
    }

    const cryptoHelper = new WechatCrypto(account.token, account.aesKey || '', appId);
    if (cryptoHelper.checkSignature(timestamp, nonce, signature)) {
      return echostr;
    }

    return '非法签名';
  }

  /**
   * 接收微信推送的消息与事件 (POST /mp/open/:appId)
   */
  @Post(':appId')
  @ApiOperation({ summary: '接收并处理微信消息推送' })
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/xml; charset=UTF-8')
  async handleMessage(
    @Param('appId') appId: string,
    @Query('signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Query('encrypt_type') encryptType: string,
    @Query('msg_signature') msgSignature: string,
    @Body() bodyContent: string
  ): Promise<string> {
    this.logger.log(`接收微信消息推送: appId=${appId}, signature=${signature}, encrypt_type=${encryptType}`);

    const account = await this.prisma.mpAccount.findUnique({ where: { appId } });
    if (!account) {
      this.logger.error(`回调处理失败，公众号账号不存在: ${appId}`);
      return '';
    }

    const cryptoHelper = new WechatCrypto(account.token, account.aesKey || '', appId);

    // 校验签名真实性
    const isValid = encryptType === 'aes'
      ? cryptoHelper.checkMsgSignature(timestamp, nonce, bodyContent, msgSignature)
      : cryptoHelper.checkSignature(timestamp, nonce, signature);

    if (!isValid) {
      this.logger.warn(`微信消息校验失败: 非法请求`);
      return '';
    }

    // 1. 解析/解密消息
    let rawXml = bodyContent;
    if (encryptType === 'aes') {
      const parsedWrapper = await parseXml(bodyContent);
      rawXml = cryptoHelper.decrypt(parsedWrapper.Encrypt);
    }

    const messageJson = await parseXml(rawXml);
    this.logger.debug(`微信推送 XML 解析为 JSON: ${JSON.stringify(messageJson)}`);

    // 2. 路由派发处理
    const outMessage = await this.routeMessage(account.id, appId, messageJson);
    if (!outMessage) {
      return '';
    }

    // 3. 返回消息包加密 (如果来时是密文，回时也需要加密)
    const outXml = buildXml(outMessage);
    if (encryptType === 'aes') {
      const encryptedData = cryptoHelper.encrypt(outXml);
      const replyObj = {
        Encrypt: encryptedData.encrypt,
        MsgSignature: encryptedData.signature,
        TimeStamp: encryptedData.timestamp,
        Nonce: encryptedData.nonce,
      };
      return buildXml(replyObj);
    }

    return outXml;
  }

  /**
   * 消息路由与分发引擎
   */
  private async routeMessage(accountId: number, appId: string, msg: any): Promise<any | null> {
    const openid = msg.FromUserName;
    const msgType = msg.MsgType;

    // 先确保本地数据库记录该粉丝的基本信息 (或进行创建)
    let localUser = await this.prisma.mpUser.findUnique({
      where: { accountId_openid: { accountId, openid } },
    });

    // 记录收到的消息历史入库 (排除一些不需要记录的消息或地理位置上报等事件)
    if (msgType !== 'event' || ['CLICK', 'VIEW'].includes(msg.Event)) {
      await this.saveIncomingMessage(accountId, appId, localUser?.id, msg);
    }

    // 处理事件推送
    if (msgType === 'event') {
      const event = msg.Event;
      
      if (event === 'subscribe') {
        // 1. 处理关注逻辑 (更新或新建粉丝基本信息)
        const wxUserInfo = await this.mpClient.getUserInfoBatch(appId, [openid])
          .then(list => list[0])
          .catch(e => {
            this.logger.error(`从微信拉取粉丝信息失败: ${e.message}`);
            return null;
          });

        const userData = {
          accountId,
          appId,
          openid,
          unionid: wxUserInfo?.unionid || null,
          subscribeStatus: 1,
          subscribeTime: wxUserInfo?.subscribe_time ? new Date(wxUserInfo.subscribe_time * 1000) : new Date(),
          nickname: wxUserInfo?.nickname || '未知用户',
          headImageUrl: wxUserInfo?.headimgurl || '',
          language: wxUserInfo?.language || 'zh_CN',
          country: wxUserInfo?.country || '',
          province: wxUserInfo?.province || '',
          city: wxUserInfo?.city || '',
          remark: wxUserInfo?.remark || '',
          sex: wxUserInfo?.sex || 0,
          tagIds: wxUserInfo?.tagid_list ? JSON.stringify(wxUserInfo.tagid_list) : '[]',
        };

        if (localUser) {
          localUser = await this.prisma.mpUser.update({
            where: { id: localUser.id },
            data: userData,
          });
        } else {
          localUser = await this.prisma.mpUser.create({ data: userData });
        }

        // 2. 触发关注回复
        return this.triggerReply(accountId, openid, 2); // type = 2 表示关注回复
      }

      if (event === 'unsubscribe') {
        // 取消关注事件
        if (localUser) {
          await this.prisma.mpUser.update({
            where: { id: localUser.id },
            data: {
              subscribeStatus: 0,
              unsubscribeTime: new Date(),
            },
          });
        }
        return null;
      }

      if (event === 'CLICK') {
        // 自定义菜单点击事件：用 EventKey 作为关键字去匹配自动回复
        return this.triggerKeywordReply(accountId, openid, msg.EventKey);
      }

      // 其他暂时未订阅的处理
      return null;
    }

    // 处理普通文字消息关键字匹配
    if (msgType === 'text') {
      const reply = await this.triggerKeywordReply(accountId, openid, msg.Content);
      if (reply) return reply;
    }

    // 默认兜底：如果没有触发任何关键字回复，可以尝试匹配消息回复 (未匹配到规则的统配回复)
    return null;
  }

  /**
   * 触发关键字匹配自动回复
   */
  private async triggerKeywordReply(accountId: number, openid: string, keyword: string): Promise<any | null> {
    // 查询启用的关键字回复规则，按照排序升序
    const replies = await this.prisma.mpAutoReply.findMany({
      where: { accountId, type: 1, status: 'ENABLE' },
      orderBy: { sort: 'asc' },
    });

    for (const rule of replies) {
      if (!rule.requestKeyword) continue;
      
      let matched = false;
      if (rule.requestMatch === 1) {
        // 全匹配
        matched = rule.requestKeyword.trim() === keyword.trim();
      } else {
        // 半匹配 (包含)
        matched = keyword.includes(rule.requestKeyword);
      }

      if (matched) {
        return this.buildReplyResponse(accountId, openid, rule);
      }
    }

    return null;
  }

  /**
   * 触发关注回复或默认回复
   */
  private async triggerReply(accountId: number, openid: string, type: number): Promise<any | null> {
    const rule = await this.prisma.mpAutoReply.findFirst({
      where: { accountId, type, status: 'ENABLE' },
      orderBy: { sort: 'asc' },
    });

    if (rule) {
      return this.buildReplyResponse(accountId, openid, rule);
    }
    return null;
  }

  /**
   * 构建微信回复的 XML 对象数据，并在本地留存发送历史
   */
  private async buildReplyResponse(accountId: number, openid: string, rule: any): Promise<any | null> {
    const timestamp = Math.floor(Date.now() / 1000);
    const commonFields = {
      ToUserName: openid,
      FromUserName: rule.appId,
      CreateTime: timestamp,
    };

    let replyMsg: any = null;
    let localContent = '';
    let localMediaId = '';

    if (rule.responseMessageType === 'text') {
      replyMsg = {
        ...commonFields,
        MsgType: 'text',
        Content: rule.responseContent,
      };
      localContent = rule.responseContent;
    } else if (rule.responseMessageType === 'image') {
      replyMsg = {
        ...commonFields,
        MsgType: 'image',
        Image: {
          MediaId: rule.responseMediaId,
        },
      };
      localMediaId = rule.responseMediaId;
    } else if (rule.responseMessageType === 'news') {
      // 图文回复格式
      const articles = typeof rule.responseArticles === 'string'
        ? JSON.parse(rule.responseArticles)
        : rule.responseArticles;
      
      if (articles && articles.length > 0) {
        const items = articles.map((art: any) => ({
          Title: art.title,
          Description: art.description,
          PicUrl: art.picUrl,
          Url: art.url,
        }));
        replyMsg = {
          ...commonFields,
          MsgType: 'news',
          ArticleCount: items.length,
          Articles: { item: items },
        };
        localContent = JSON.stringify(items);
      }
    }

    if (replyMsg) {
      // 留存系统发给粉丝的历史记录
      await this.prisma.mpMessage.create({
        data: {
          accountId,
          appId: rule.appId,
          openid,
          type: rule.responseMessageType,
          sendFrom: 2, // 2: 系统回复粉丝
          content: localContent,
          mediaId: localMediaId,
          createdAt: new Date(),
        },
      });
    }

    return replyMsg;
  }

  /**
   * 记录粉丝发来的普通消息
   */
  private async saveIncomingMessage(accountId: number, appId: string, userId: number | undefined, msg: any) {
    let content = '';
    let mediaId = '';
    let mediaUrl = '';
    let event = '';
    let eventKey = '';

    const msgType = msg.MsgType;

    if (msgType === 'text') {
      content = msg.Content;
    } else if (msgType === 'image') {
      mediaId = msg.MediaId;
      mediaUrl = msg.PicUrl;
    } else if (msgType === 'voice') {
      mediaId = msg.MediaId;
      content = msg.Recognition || ''; // 开启语音识别时可能包含识别文本
    } else if (msgType === 'video' || msgType === 'shortvideo') {
      mediaId = msg.MediaId;
    } else if (msgType === 'event') {
      event = msg.Event;
      eventKey = msg.EventKey;
      content = `点击菜单事件: ${eventKey}`;
    }

    await this.prisma.mpMessage.create({
      data: {
        msgId: msg.MsgId ? BigInt(msg.MsgId) : null,
        accountId,
        appId,
        userId: userId || null,
        openid: msg.FromUserName,
        type: msgType,
        sendFrom: 1, // 1: 粉丝发给系统
        content,
        mediaId: mediaId || null,
        mediaUrl: mediaUrl || null,
        event: event || null,
        eventKey: eventKey || null,
        createdAt: new Date(),
      },
    });
  }
}
