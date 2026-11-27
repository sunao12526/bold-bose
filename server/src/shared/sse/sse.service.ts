import { Injectable, MessageEvent, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

interface ClientConnection {
  key: string;
  subject: Subject<MessageEvent>;
  heartbeat: NodeJS.Timeout;
}

@Injectable()
export class SseService implements OnModuleDestroy {
  private readonly connections = new Map<string, Set<ClientConnection>>();

  private makeKey(userId: number, userType = 2): string {
    return `${userType}:${userId}`;
  }

  connect(userId: number, userType = 2): Observable<MessageEvent> {
    const key = this.makeKey(userId, userType);
    const subject = new Subject<MessageEvent>();

    const heartbeat = setInterval(() => {
      if (!subject.closed) {
        subject.next({
          type: 'ping',
          data: { timestamp: Date.now() },
        });
      }
    }, 30_000);
    heartbeat.unref();

    const conn: ClientConnection = { key, subject, heartbeat };
    if (!this.connections.has(key)) {
      this.connections.set(key, new Set());
    }
    this.connections.get(key)!.add(conn);

    // 推送建连成功握手事件
    queueMicrotask(() => {
      if (!subject.closed) {
        subject.next({
          type: 'connected',
          data: { userId, userType, timestamp: Date.now() },
        });
      }
    });

    return new Observable<MessageEvent>((subscriber) => {
      const sub = subject.subscribe(subscriber);
      return () => {
        sub.unsubscribe();
        clearInterval(heartbeat);
        subject.complete();
        const set = this.connections.get(key);
        if (set) {
          set.delete(conn);
          if (set.size === 0) {
            this.connections.delete(key);
          }
        }
      };
    });
  }

  sendToUser(
    userId: number,
    type: string,
    data: unknown,
    userType = 2,
  ): number {
    const key = this.makeKey(userId, userType);
    const set = this.connections.get(key);
    if (!set || set.size === 0) {
      return 0;
    }
    let delivered = 0;
    for (const conn of set) {
      if (!conn.subject.closed) {
        conn.subject.next({ type, data: data as any });
        delivered += 1;
      }
    }
    return delivered;
  }

  broadcast(type: string, data: unknown, userType?: number): number {
    let delivered = 0;
    for (const [key, set] of this.connections.entries()) {
      if (userType !== undefined && !key.startsWith(`${userType}:`)) {
        continue;
      }
      for (const conn of set) {
        if (!conn.subject.closed) {
          conn.subject.next({ type, data: data as any });
          delivered += 1;
        }
      }
    }
    return delivered;
  }

  getOnlineStats(): { onlineUsers: number; onlineConnections: number } {
    let onlineConnections = 0;
    for (const set of this.connections.values()) {
      onlineConnections += set.size;
    }
    return {
      onlineUsers: this.connections.size,
      onlineConnections,
    };
  }

  onModuleDestroy(): void {
    for (const set of this.connections.values()) {
      for (const conn of set) {
        clearInterval(conn.heartbeat);
        if (!conn.subject.closed) {
          conn.subject.complete();
        }
      }
    }
    this.connections.clear();
  }
}
