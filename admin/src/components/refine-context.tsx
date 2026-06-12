'use client';

import React from 'react';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { ThemedLayout, useNotificationProvider } from '@refinedev/antd';
import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { authProvider } from '../providers/auth-provider';
import { dataProvider } from '../providers/data-provider';

import '@refinedev/antd/dist/reset.css';

export const RefineContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        },
      }}
    >
      <App>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          resources={[
            {
              name: 'system/user',
              list: '/system/user',
              meta: {
                label: '用户管理',
                icon: 'UserOutlined',
              },
            },
            {
              name: 'system/role',
              list: '/system/role',
              meta: {
                label: '角色管理',
                icon: 'TeamOutlined',
              },
            },
            {
              name: 'system/menu',
              list: '/system/menu',
              meta: {
                label: '菜单管理',
                icon: 'MenuOutlined',
              },
            },
            {
              name: 'system/dict',
              list: '/system/dict',
              meta: {
                label: '字典管理',
                icon: 'BookOutlined',
              },
            },
            {
              name: 'system/config',
              list: '/system/config',
              meta: {
                label: '参数配置',
                icon: 'ControlOutlined',
              },
            },
            {
              name: 'infra/file-config',
              list: '/infra/file-config',
              meta: {
                label: '文件配置',
                icon: 'ToolOutlined',
              },
            },
            {
              name: 'infra/file',
              list: '/infra/file',
              meta: {
                label: '文件列表',
                icon: 'FileOutlined',
              },
            },
            {
              name: 'infra/log',
              list: '/infra/log',
              meta: {
                label: '系统日志',
                icon: 'FileTextOutlined',
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          {children}
        </Refine>
      </App>
    </ConfigProvider>
  );
};
