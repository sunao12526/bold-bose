import { MessageEvent } from '@nestjs/common';
import { SseService } from './sse.service';

describe('SseService', () => {
  let service: SseService;

  beforeEach(() => {
    service = new SseService();
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('应该支持建连、定向推送、广播并在取消订阅后清理连接', async () => {
    const events1: MessageEvent[] = [];
    const events2: MessageEvent[] = [];

    const sub1 = service.connect(10, 2).subscribe((ev) => events1.push(ev));
    const sub2 = service.connect(20, 2).subscribe((ev) => events2.push(ev));

    await Promise.resolve();
    expect(service.getOnlineStats()).toEqual({
      onlineUsers: 2,
      onlineConnections: 2,
    });
    expect(events1[0]?.type).toBe('connected');

    const delivered = service.sendToUser(10, 'notify', { title: '新通知' }, 2);
    expect(delivered).toBe(1);
    expect(events1.some((e) => e.type === 'notify')).toBe(true);
    expect(events2.some((e) => e.type === 'notify')).toBe(false);

    const broadcastCount = service.broadcast('system', { msg: '维护公告' }, 2);
    expect(broadcastCount).toBe(2);

    sub1.unsubscribe();
    expect(service.getOnlineStats()).toEqual({
      onlineUsers: 1,
      onlineConnections: 1,
    });

    sub2.unsubscribe();
    expect(service.getOnlineStats()).toEqual({
      onlineUsers: 0,
      onlineConnections: 0,
    });
  });
});
