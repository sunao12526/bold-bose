'use client';

import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, MenuOutlined } from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const { data: user } = useGetIdentity<{ nickname: string }>();

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false} style={{ marginBottom: '24px', borderRadius: '8px' }}>
        <Title level={2}>欢迎回来，{user?.nickname || '管理员'}！</Title>
        <Paragraph>
          这是基于 NestJS (Backend) + Next.js (Refine + Ant Design) 的快速开发管理后台。
        </Paragraph>
      </Card>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="用户总数"
              value={1}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="角色总数"
              value={2}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="菜单总数"
              value={7}
              prefix={<MenuOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
