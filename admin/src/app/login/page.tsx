'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { useLogin } from '@refinedev/core';
import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, GithubOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../lib/axios';

const { Title, Text } = Typography;

export default function Login() {
  const { mutate: login, isPending } = useLogin();

  const handleGithubLogin = async () => {
    try {
      const redirectUri = window.location.origin + '/social-callback';
      const res = await axiosInstance.get(`/system/auth/social-login-url?type=GITHUB&redirectUri=${encodeURIComponent(redirectUri)}`);
      window.location.href = res.data.url;
    } catch (err: any) {
      message.error(err.response?.data?.message || '获取社交登录链接失败');
    }
  };

  const handleMockLogin = () => {
    window.location.href = `/social-callback?code=mock_code`;
  };

  const onFinish = (values: any) => {
    login({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
      padding: '16px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          background: 'rgba(255, 255, 255, 0.95)',
          overflow: 'hidden'
        }}
        styles={{ body: { padding: '32px 24px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Space align="center" style={{ marginBottom: '12px' }}>
            <SafetyOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
            <Title level={3} style={{ margin: 0, fontWeight: 700, letterSpacing: '1px' }}>
              芋道云管理系统
            </Title>
          </Space>
          <div>
            <Text type="secondary">极简、高性能的后台管理门户</Text>
          </div>
        </div>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ username: 'admin', password: 'admin123' }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名长度不能少于 3 个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="管理员用户名" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="账户密码"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              style={{
                height: '44px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                boxShadow: '0 4px 10px rgba(22, 119, 255, 0.3)'
              }}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

        <Divider plain><Text type="secondary" style={{ fontSize: '12px' }}>其他登录方式</Text></Divider>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <Button 
            shape="circle" 
            icon={<GithubOutlined />} 
            onClick={handleGithubLogin} 
            title="GitHub 登录" 
          />
          <Button 
            onClick={handleMockLogin}
            size="small"
            type="dashed"
          >
            模拟 GitHub 登录
          </Button>
        </div>
      </Card>
    </div>
  );
}
