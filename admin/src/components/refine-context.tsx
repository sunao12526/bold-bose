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
              name: 'system/notify-template',
              list: '/system/notify-template',
              meta: {
                label: '通知模板',
                icon: 'MailOutlined',
              },
            },
            {
              name: 'system/user-session',
              list: '/system/user-session',
              meta: {
                label: '在线用户',
                icon: 'MonitorOutlined',
              },
            },
            {
              name: 'system/posts',
              list: '/system/posts',
              meta: {
                label: '文章管理',
                icon: 'FileTextOutlined',
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
            {
              name: 'infra/codegen',
              list: '/infra/codegen',
              meta: {
                label: '代码生成',
                icon: 'CodeOutlined',
              },
            },
            {
              name: 'infra/job',
              list: '/infra/job',
              meta: {
                label: '定时任务',
                icon: 'ScheduleOutlined',
              },
            },
            {
              name: 'mall/category',
              list: '/mall/category',
              meta: {
                label: '商品分类',
                icon: 'AppstoreOutlined',
              },
            },
            {
              name: 'mall/brand',
              list: '/mall/brand',
              meta: {
                label: '商品品牌',
                icon: 'CopyrightOutlined',
              },
            },
            {
              name: 'mall/property',
              list: '/mall/property',
              meta: {
                label: '规格管理',
                icon: 'TagsOutlined',
              },
            },
            {
              name: 'mall/spu',
              list: '/mall/spu',
              meta: {
                label: '商品列表',
                icon: 'ShoppingOutlined',
              },
            },
            {
              name: 'member/user',
              list: '/member/user',
              meta: {
                label: '会员列表',
                icon: 'UserOutlined',
              },
            },
            {
              name: 'member/level',
              list: '/member/level',
              meta: {
                label: '会员等级',
                icon: 'TrophyOutlined',
              },
            },
            {
              name: 'member/tag',
              list: '/member/tag',
              meta: {
                label: '会员标签',
                icon: 'TagsOutlined',
              },
            },
            {
              name: 'member/sign-in-config',
              list: '/member/sign-in-config',
              meta: {
                label: '签到规则',
                icon: 'ScheduleOutlined',
              },
            },
            {
              name: 'member/sign-in-record',
              list: '/member/sign-in-record',
              meta: {
                label: '签到记录',
                icon: 'HistoryOutlined',
              },
            },
            {
              name: 'mall/order',
              list: '/mall/order',
              meta: {
                label: '订单管理',
                icon: 'FileTextOutlined',
              },
            },
            {
              name: 'mall/refund',
              list: '/mall/order-refund',
              meta: {
                label: '退款售后',
                icon: 'ReloadOutlined',
              },
            },
            {
              name: 'mall/coupon',
              list: '/mall/coupon',
              meta: {
                label: '优惠券管理',
                icon: 'GiftOutlined',
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
