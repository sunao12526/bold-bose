'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Tag } from 'antd';
import { useTable } from '@refinedev/antd';

export default function MpMessageList() {
  const { tableProps } = useTable({ resource: 'mp/message', syncWithLocation: true });

  return (
    <div style={{ padding: '24px' }}>
      <List title="消息记录">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="openid" title="粉丝OpenID" ellipsis />
          <Table.Column dataIndex="type" title="消息类型" width={80} render={(t: string) => <Tag>{t}</Tag>} />
          <Table.Column dataIndex="content" title="内容" ellipsis />
          <Table.Column dataIndex="sendFrom" title="来源" width={80} render={(f: number) => <Tag color={f === 1 ? 'blue' : 'green'}>{f === 1 ? '粉丝' : '系统'}</Tag>} />
          <Table.Column dataIndex="createdAt" title="时间" width={160} render={(t: string) => new Date(t).toLocaleString()} />
        </Table>
      </List>
    </div>
  );
}
