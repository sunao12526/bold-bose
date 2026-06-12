'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Row, Col, Space, Typography, Tag, message, Progress } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, MailOutlined, PhoneOutlined, KeyOutlined } from '@ant-design/icons';
import { useLogout } from '@refinedev/core';
import { axiosInstance } from '../../../../lib/axios';

const { Title, Text, Paragraph } = Typography;

export default function UserProfile() {
  const { mutate: logout } = useLogout();
  
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // 1. Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/system/user/profile');
      const data = response.data;
      setProfile(data.user);
      setRoles(data.roles || []);
      profileForm.setFieldsValue({
        nickname: data.user.nickname,
        email: data.user.email,
        mobile: data.user.mobile,
      });
    } catch (err: any) {
      console.error(err);
      message.error('加载个人信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. Update Profile Handler
  const handleUpdateProfile = async (values: any) => {
    setUpdatingProfile(true);
    try {
      await axiosInstance.put('/system/user/profile', values);
      message.success('基本资料修改成功！');
      fetchProfile();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || '资料修改失败');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // 3. Update Password Handler
  const handleUpdatePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致！');
      return;
    }
    setUpdatingPassword(true);
    try {
      await axiosInstance.put('/system/user/profile/update-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success('密码修改成功，请重新登录！');
      // Forcibly logout
      logout();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || '原密码错误，修改密码失败');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // 4. Dynamic Password Strength Evaluation
  const evaluatePasswordStrength = (pwd: string) => {
    if (!pwd) return { percent: 0, status: 'exception' as any, text: '无', color: 'gray' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { percent: 30, status: 'exception' as any, text: '弱', color: '#ff4d4f' };
    if (score <= 4) return { percent: 70, status: 'active' as any, text: '中', color: '#faad14' };
    return { percent: 100, status: 'success' as any, text: '强', color: '#52c41a' };
  };

  const strength = evaluatePasswordStrength(newPasswordVal);

  if (loading && !profile) {
    return <div style={{ padding: '24px' }}>正在加载个人信息...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        {/* Left Side: Avatar & Simple Details Card */}
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} style={{ textAlign: 'center', height: '100%', borderRadius: '8px' }}>
            <div style={{ margin: '16px 0' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#1890ff',
                color: '#fff',
                fontSize: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}>
                {profile?.nickname?.[0]?.toUpperCase() || <UserOutlined />}
              </div>
              <Title level={4} style={{ marginBottom: 4 }}>{profile?.nickname}</Title>
              <Paragraph type="secondary">@{profile?.username}</Paragraph>
            </div>
            
            <div style={{ textAlign: 'left', marginTop: 32, borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
              <Paragraph>
                <Space>
                  <LockOutlined style={{ color: '#8c8c8c' }} />
                  <Text strong>所属角色:</Text>
                </Space>
                <div style={{ marginTop: 8 }}>
                  {roles.length === 0 ? (
                    <Tag>暂无角色</Tag>
                  ) : (
                    roles.map((r: any) => (
                      <Tag color="purple" key={r.code} style={{ marginBottom: 4 }}>
                        {r.name}
                      </Tag>
                    ))
                  )}
                </div>
              </Paragraph>
              
              <Paragraph style={{ marginTop: 16 }}>
                <Space>
                  <SafetyCertificateOutlined style={{ color: '#8c8c8c' }} />
                  <Text strong>安全等级:</Text>
                  <Tag color="green">高</Tag>
                </Space>
              </Paragraph>

              <Paragraph style={{ marginTop: 16 }}>
                <Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    注册时间: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '未知'}
                  </Text>
                </Space>
              </Paragraph>
            </div>
          </Card>
        </Col>

        {/* Right Side: Tab Forms */}
        <Col xs={24} sm={24} md={16}>
          <Card bordered={false} style={{ borderRadius: '8px' }}>
            <Tabs defaultActiveKey="info">
              {/* Tab 1: Basic Info */}
              <Tabs.TabPane tab={<span><UserOutlined />基本资料</span>} key="info">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  style={{ maxWidth: 480, marginTop: 16 }}
                >
                  <Form.Item label="用户账号">
                    <Input disabled value={profile?.username} prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} />
                  </Form.Item>

                  <Form.Item
                    name="nickname"
                    label="用户昵称"
                    rules={[{ required: true, message: '用户昵称不能为空' }]}
                  >
                    <Input placeholder="请输入用户昵称" prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="电子邮箱"
                    rules={[
                      { type: 'email', message: '邮箱格式不正确' },
                      { required: true, message: '电子邮箱不能为空' }
                    ]}
                  >
                    <Input placeholder="请输入电子邮箱" prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} />
                  </Form.Item>

                  <Form.Item
                    name="mobile"
                    label="手机号码"
                    rules={[
                      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
                      { required: true, message: '手机号码不能为空' }
                    ]}
                  >
                    <Input placeholder="请输入手机号码" prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updatingProfile}>
                      保存修改
                    </Button>
                  </Form.Item>
                </Form>
              </Tabs.TabPane>

              {/* Tab 2: Change Password */}
              <Tabs.TabPane tab={<span><KeyOutlined />安全设置</span>} key="security">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleUpdatePassword}
                  style={{ maxWidth: 480, marginTop: 16 }}
                >
                  <Form.Item
                    name="oldPassword"
                    label="当前密码"
                    rules={[{ required: true, message: '请输入当前密码' }]}
                  >
                    <Input.Password placeholder="请输入当前密码" prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 6, message: '新密码长度至少为 6 位' }
                    ]}
                  >
                    <Input.Password
                      placeholder="请输入新密码"
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                    />
                  </Form.Item>

                  {newPasswordVal && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>密码强度:</Text>
                        <Text style={{ fontSize: 12, color: strength.color, fontWeight: 'bold' }}>{strength.text}</Text>
                      </div>
                      <Progress 
                        percent={strength.percent} 
                        status={strength.status} 
                        strokeColor={strength.color} 
                        showInfo={false} 
                        size="small"
                      />
                    </div>
                  )}

                  <Form.Item
                    name="confirmPassword"
                    label="确认新密码"
                    rules={[
                      { required: true, message: '请确认您的新密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('两次输入的密码不匹配！'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="请确认新密码" prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updatingPassword} danger>
                      修改密码
                    </Button>
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
