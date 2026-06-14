'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Tag } from 'antd';
import { useTable } from '@refinedev/antd';

export default function SmsLogList() {
  const { tableProps } = useTable({
    resource: 'system/sms/log',
    syncWithLocation: true,
  });

  return (
    <div style={{ padding: '24px' }}>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="日志编号" width={100} />
          <Table.Column 
            dataIndex={['template', 'name']} 
            title="模板名称" 
          />
          <Table.Column 
            dataIndex={['template', 'code']} 
            title="模板编码" 
          />
          <Table.Column dataIndex="mobile" title="接收手机" />
          <Table.Column dataIndex="content" title="短信内容" ellipsis />
          <Table.Column 
            dataIndex="status" 
            title="发送状态" 
            render={(val: string) => (
              <Tag color={val === 'SUCCESS' ? 'green' : 'red'}>
                {val === 'SUCCESS' ? '成功' : '失败'}
              </Tag>
            )}
          />
          <Table.Column dataIndex="errorMessage" title="错误原因" render={(val) => val || '-'} ellipsis />
          <Table.Column 
            dataIndex="sendTime" 
            title="发送时间" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
        </Table>
      </List>
    </div>
  );
}
