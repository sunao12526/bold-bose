'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Tag } from 'antd';
import { useTable } from '@refinedev/antd';
import { ExcelExportButton } from '@/components/excel/ExcelExportButton';

export default function LoginLogList() {
  const { tableProps } = useTable({
    resource: 'system/login-log',
    syncWithLocation: true,
  });

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: (
            <ExcelExportButton
              resource="system/login-log"
              filename="登录日志列表"
              columns={[
                { title: '日志编号', dataIndex: 'id' },
                { title: '用户名', dataIndex: 'username' },
                { title: '登录 IP', dataIndex: 'ip' },
                { title: '登录地点', dataIndex: 'location' },
                {
                  title: '登录状态',
                  dataIndex: 'status',
                  render: (status) => (status === 'SUCCESS' ? '成功' : '失败'),
                },
                { title: '登录信息', dataIndex: 'message' },
                { title: '用户代理', dataIndex: 'userAgent' },
                { title: '登录时间', dataIndex: 'loginTime', render: (val) => val ? new Date(val).toLocaleString() : '-' },
              ]}
            />
          )
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="日志编号" width={100} />
          <Table.Column dataIndex="username" title="用户名" width={120} />
          <Table.Column dataIndex="ip" title="登录 IP" width={150} />
          <Table.Column dataIndex="location" title="登录地点" width={150} render={(val) => val || '-'} />
          <Table.Column 
            dataIndex="status" 
            title="登录状态" 
            width={120}
            render={(val: string) => (
              <Tag color={val === 'SUCCESS' ? 'green' : 'red'}>
                {val === 'SUCCESS' ? '成功' : '失败'}
              </Tag>
            )}
          />
          <Table.Column dataIndex="message" title="登录信息" render={(val) => val || '-'} />
          <Table.Column dataIndex="userAgent" title="用户代理" ellipsis />
          <Table.Column 
            dataIndex="loginTime" 
            title="登录时间" 
            width={180}
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
        </Table>
      </List>
    </div>
  );
}
