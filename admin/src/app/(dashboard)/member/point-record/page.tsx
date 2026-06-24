'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Tag, Input, Form, Button, Card, Select } from 'antd';
import { useTable } from '@refinedev/antd';
import { SearchOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface PointRecord {
  id: number;
  memberId: number;
  bizType: string;
  bizId?: string;
  point: number;
  afterPoint: number;
  operatorId?: string;
  description?: string;
  createdAt: string;
  member?: {
    nickname: string;
    mobile: string;
  };
}

export default function MemberPointRecordList() {
  const { tableProps, searchFormProps } = useTable<PointRecord>({
    resource: 'member/point-record',
    onSearch: (params: any) => {
      return [
        { field: 'memberId', operator: 'eq', value: params.memberId },
        { field: 'bizType', operator: 'eq', value: params.bizType },
      ];
    },
    syncWithLocation: true,
  });

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '16px' }} styles={{ body: { padding: '16px' } }}>
        <Form {...searchFormProps} layout="inline">
          <Form.Item name="memberId" label="会员 ID">
            <Input placeholder="输入精确会员ID" allowClear style={{ width: '150px' }} />
          </Form.Item>
          <Form.Item name="bizType" label="业务类型" style={{ width: '180px' }}>
            <Select placeholder="全部" allowClear>
              <Select.Option value="ADMIN">管理员调整</Select.Option>
              <Select.Option value="SIGN">签到奖励</Select.Option>
              <Select.Option value="ORDER_USE">订单消费抵扣</Select.Option>
              <Select.Option value="ORDER_REFUND">订单退款返还</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                筛选
              </Button>
              <Button onClick={() => searchFormProps.form?.resetFields()} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <List title="全局积分变动审计明细">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="流水 ID" width={80} />
          <Table.Column 
            title="会员基本信息" 
            render={(_, record: PointRecord) => (
              <div>
                <strong>{record.member?.nickname || '未知用户'}</strong>
                <div style={{ fontSize: '11px', color: '#8c8c8c' }}>ID: {record.memberId} | 手机: {record.member?.mobile || '-'}</div>
              </div>
            )}
          />
          <Table.Column 
            dataIndex="bizType" 
            title="业务变动类型" 
            width={150}
            render={(bizType: string) => {
              const maps: any = {
                ADMIN: { label: '管理员修改', color: 'orange' },
                SIGN: { label: '签到奖励', color: 'green' },
                ORDER_USE: { label: '订单消费抵扣', color: 'red' },
                ORDER_REFUND: { label: '订单退款返还', color: 'blue' },
              };
              const config = maps[bizType] || { label: bizType, color: 'default' };
              return <Tag color={config.color}>{config.label}</Tag>;
            }}
          />
          <Table.Column dataIndex="bizId" title="关联单号/业务ID" width={140} render={(val) => val || '-'} />
          <Table.Column 
            dataIndex="point" 
            title="变动积分" 
            width={120}
            render={(point: number) => (
              <strong style={{ color: point >= 0 ? '#52c41a' : '#f5222d' }}>
                {point >= 0 ? `+${point}` : point}
              </strong>
            )}
          />
          <Table.Column dataIndex="afterPoint" title="变动后账户积分" width={130} />
          <Table.Column dataIndex="description" title="原因描述" />
          <Table.Column dataIndex="operatorId" title="操作员" width={100} render={(val) => val || 'system'} />
          <Table.Column 
            dataIndex="createdAt" 
            title="变动时间" 
            render={(val: string) => (
              <Space>
                <HistoryOutlined style={{ color: '#bfbfbf' }} />
                <span>{dayjs(val).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Space>
            )}
          />
        </Table>
      </List>
    </div>
  );
}
