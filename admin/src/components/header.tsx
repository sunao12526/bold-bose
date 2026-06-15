'use client';

import React, { useState, useEffect } from 'react';
import { useGetIdentity, useLogout } from '@refinedev/core';
import { Layout, Badge, Popover, List, Button, Avatar, Space, Typography, Empty, message, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { axiosInstance } from '../lib/axios';

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

export const CustomHeader: React.FC = () => {
  const { data: user } = useGetIdentity<{ nickname: string; username: string }>();
  const { mutate: logout } = useLogout();
  
  const [inbox, setInbox] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch user inbox
  const fetchInbox = async () => {
    try {
      const response = await axiosInstance.get('/system/notify-message/my-inbox');
      const messages = response.data || [];
      setInbox(messages);
      setUnreadCount(messages.filter((m: any) => !m.read).length);
    } catch (err) {
      console.error('Failed to fetch inbox notifications:', err);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Poll every 30 seconds
    const interval = setInterval(fetchInbox, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark a single notification as read
  const handleMarkRead = async (id: number) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/system/notify-message/mark-read/${id}`);
      message.success('已标记为已读');
      await fetchInbox();
    } catch (err) {
      console.error(err);
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await axiosInstance.put('/system/notify-message/mark-all-read');
      message.success('已全部标记为已读');
      await fetchInbox();
    } catch (err) {
      console.error(err);
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  // Profile menu options
  const profileMenuItems = [
    {
      key: 'username',
      disabled: true,
      label: (
        <>
          <Text strong>{user?.nickname || '管理员'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>@{user?.username}</Text>
        </>
      ),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => {
        window.location.href = '/system/profile';
      },
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: '退出登录',
      onClick: () => {
        logout();
      },
    },
  ];

  // Notification panel content
  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingBottom: 8, 
        borderBottom: '1px solid #f0f0f0',
        marginBottom: 8 
      }}>
        <Text strong>通知中心 ({unreadCount})</Text>
        {unreadCount > 0 && (
          <Button 
            type="link" 
            size="small" 
            icon={<CheckCircleOutlined />} 
            onClick={handleMarkAllRead}
            disabled={loading}
          >
            全部已读
          </Button>
        )}
      </div>

      {inbox.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无新消息" style={{ margin: '20px 0' }} />
      ) : (
        <List
          dataSource={inbox.slice(0, 10)} // Show top 10 messages
          style={{ maxHeight: 350, overflowY: 'auto' }}
          renderItem={(item) => (
            <List.Item 
              style={{ 
                padding: '8px 4px', 
                backgroundColor: item.read ? 'transparent' : '#f0f5ff',
                borderRadius: 4,
                marginBottom: 4,
                transition: 'all 0.3s'
              }}
              actions={[
                !item.read && (
                  <Button 
                    key="read"
                    type="link" 
                    size="small" 
                    onClick={() => handleMarkRead(item.id)}
                    disabled={loading}
                  >
                    已读
                  </Button>
                )
              ].filter(Boolean)}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {!item.read && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1890ff', display: 'inline-block' }} />}
                    <Text strong={!item.read} style={{ fontSize: 13 }}>
                      {item.title}
                    </Text>
                  </div>
                }
                description={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.content}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#bfbfbf' }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <AntdHeader style={{
      background: '#fff',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '0 24px',
      height: '64px',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 999,
    }}>
      <Space size={24}>
        {/* Notification Bell */}
        <Popover 
          content={notificationContent} 
          trigger="click" 
          placement="bottomRight"
          overlayClassName="premium-notification-popover"
        >
          <Badge count={unreadCount} overflowCount={99} size="small" style={{ cursor: 'pointer' }}>
            <Button 
              type="text" 
              icon={<BellOutlined style={{ fontSize: 20 }} />} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            />
          </Badge>
        </Popover>

        {/* User profile dropdown */}
        <Dropdown menu={{ items: profileMenuItems }} trigger={['click']}>
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <Text strong>{user?.nickname || '管理员'}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntdHeader>
  );
};
