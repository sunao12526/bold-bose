'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Tag } from 'antd';
import { useTable } from '@refinedev/antd';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface SignInRecord {
  id: number;
  memberId: number;
  day: number;
  point: number;
  createdAt: string;
  member?: {
    id: number;
    nickname: string;
    mobile: string;
  } | null;
}

export default function SignInRecordList() {
  const { tableProps } = useTable<SignInRecord>({
    resource: 'member/sign-in-record',
    syncWithLocation: true,
  });

  return (
    <div style={{ padding: '24px' }}>
      <List title="会员签到历史记录">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="记录 ID" width={80} />
          <Table.Column 
            title="会员信息" 
            width={220}
            render={(_, record: SignInRecord) => (
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <div>
                  <span style={{ fontWeight: '500' }}>{record.member?.nickname || '未知用户'}</span>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.member?.mobile || '-'}</div>
                </div>
              </Space>
            )}
          />
          <Table.Column 
            dataIndex="day" 
            title="连续签到天数" 
            width={150}
            render={(day: number) => (
              <Tag color="blue" icon={<CalendarOutlined />}>
                第 {day} 天
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="point" 
            title="签到奖励积分" 
            width={150}
            render={(point: number) => (
              <span style={{ color: '#d46b08', fontWeight: 'bold', fontSize: '14px' }}>
                +{point} 分
              </span>
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="签到时间" 
            render={(val: string) => (
              <Space>
                <ClockCircleOutlined style={{ color: '#bfbfbf' }} />
                <span>{dayjs(val).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Space>
            )}
          />
        </Table>
      </List>
    </div>
  );
}
