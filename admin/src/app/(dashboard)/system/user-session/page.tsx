'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Form, Input, Card, Popconfirm, message, Tag } from 'antd';
import { useTable } from '@refinedev/antd';
import { SearchOutlined, PoweroffOutlined, LaptopOutlined, GlobalOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function UserSessionList() {
  const [searchForm] = Form.useForm();

  // 1. Refine table hook
  const { tableProps, searchFormProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/user-session',
    syncWithLocation: true,
    onSearch: (values: any) => {
      return [
        {
          field: 'username',
          operator: 'contains',
          value: values.username,
        },
        {
          field: 'ip',
          operator: 'contains',
          value: values.ip,
        },
      ];
    },
  });

  // 2. Handle session kickout
  const handleKickout = async (id: string, nickname: string) => {
    try {
      await axiosInstance.delete(`/system/user-session/${id}`);
      message.success(`已成功强退用户 [${nickname}] 的登录会话！`);
      tableQueryResult.refetch();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || '强退操作失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Search Filter Card */}
      <Card variant="borderless" style={{ marginBottom: '16px', borderRadius: '8px' }}>
        <Form {...searchFormProps} form={searchForm} layout="inline">
          <Form.Item name="username" label="用户账号">
            <Input placeholder="请输入用户账号" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="ip" label="登录IP">
            <Input placeholder="请输入登录IP" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={() => searchForm.resetFields()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Online Users List */}
      <List title="在线用户与会话管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column 
            dataIndex="id" 
            title="会话编号" 
            width={120} 
            render={(id: string) => <Tag color="gray">{id.slice(0, 8)}...</Tag>}
          />
          <Table.Column 
            dataIndex="username" 
            title="用户账号" 
            render={(text: string) => <strong style={{ color: '#1890ff' }}>{text}</strong>}
          />
          <Table.Column dataIndex="nickname" title="用户昵称" />
          <Table.Column 
            dataIndex="ip" 
            title="登录IP" 
            render={(ip: string) => (
              <Space>
                <GlobalOutlined style={{ color: '#52c41a' }} />
                <span>{ip}</span>
              </Space>
            )}
          />
          <Table.Column 
            dataIndex="browser" 
            title="浏览器" 
            render={(browser: string) => (
              <Tag color="blue">{browser || 'Unknown'}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="os" 
            title="操作系统" 
            render={(os: string) => (
              <Tag color="cyan">{os || 'Unknown'}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="loginTime" 
            title="登录时间" 
            render={(time: string) => new Date(time).toLocaleString()} 
          />
          <Table.Column 
            dataIndex="lastActiveTime" 
            title="最后活跃时间" 
            render={(time: string) => new Date(time).toLocaleString()} 
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            render={(_, record: any) => (
              <Popconfirm
                title="提示"
                description={`确定要强制断开用户 [${record.nickname}] 的当前登录会话吗？`}
                onConfirm={() => handleKickout(record.id, record.nickname)}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  size="small" 
                  type="text" 
                  danger 
                  icon={<PoweroffOutlined />}
                >
                  强退
                </Button>
              </Popconfirm>
            )}
          />
        </Table>
      </List>
    </div>
  );
}
