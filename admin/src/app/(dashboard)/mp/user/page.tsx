'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Tag, Input, Space } from 'antd';
import { useTable } from '@refinedev/antd';
import { SearchOutlined } from '@ant-design/icons';

export default function MpUserList() {
  const { tableProps, tableQuery, filters, setFilters } = useTable({ resource: 'mp/user', syncWithLocation: true });

  return (
    <div style={{ padding: '24px' }}>
      <List title="粉丝管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="openid" title="OpenID" ellipsis />
          <Table.Column dataIndex="nickname" title="昵称" />
          <Table.Column dataIndex="subscribeStatus" title="关注状态" width={90} render={(s: number) => <Tag color={s === 1 ? 'green' : 'red'}>{s === 1 ? '已关注' : '未关注'}</Tag>} />
          <Table.Column dataIndex="sex" title="性别" width={60} render={(s: number) => s === 1 ? '男' : s === 2 ? '女' : '未知'} />
          <Table.Column dataIndex="country" title="国家" width={80} />
          <Table.Column dataIndex="province" title="省份" width={80} />
          <Table.Column dataIndex="city" title="城市" width={80} />
          <Table.Column dataIndex="subscribeTime" title="关注时间" width={160} render={(t: string) => t ? new Date(t).toLocaleString() : '-'} />
        </Table>
      </List>
    </div>
  );
}
