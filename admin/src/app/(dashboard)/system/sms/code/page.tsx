'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Tag } from 'antd';
import { useTable } from '@refinedev/antd';

export default function SmsCodeList() {
  const { tableProps } = useTable({
    resource: 'system/sms/code',
    syncWithLocation: true,
  });

  const getSceneLabel = (scene: number) => {
    switch (scene) {
      case 1:
        return '登录/注册';
      case 2:
        return '绑定手机';
      case 3:
        return '修改密码';
      default:
        return `场景 ${scene}`;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="编号" width={80} />
          <Table.Column dataIndex="mobile" title="手机号" />
          <Table.Column 
            dataIndex="code" 
            title="验证码" 
            render={(val) => <Tag color="orange" style={{ fontWeight: 'bold' }}>{val}</Tag>} 
          />
          <Table.Column 
            dataIndex="scene" 
            title="发送场景" 
            render={(val) => getSceneLabel(val)} 
          />
          <Table.Column 
            dataIndex="todayIndex" 
            title="今日发送序号" 
            width={120}
          />
          <Table.Column 
            dataIndex="used" 
            title="使用状态" 
            render={(used: boolean) => (
              <Tag color={used ? 'red' : 'green'}>
                {used ? '已使用' : '未使用'}
              </Tag>
            )}
          />
          <Table.Column dataIndex="usedIp" title="使用 IP" render={(val) => val || '-'} />
          <Table.Column 
            dataIndex="usedTime" 
            title="使用时间" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="发送时间" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
          <Table.Column 
            dataIndex="expiredAt" 
            title="过期时间" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
        </Table>
      </List>
    </div>
  );
}
