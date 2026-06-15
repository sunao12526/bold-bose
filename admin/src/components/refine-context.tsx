'use client';

import React from 'react';
import { Refine } from '@refinedev/core';
import routerProvider from '@refinedev/nextjs-router';
import { ThemedLayout, useNotificationProvider } from '@refinedev/antd';
import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { authProvider } from '../providers/auth-provider';
import { dataProvider } from '../providers/data-provider';

import {
  SettingOutlined,
  DatabaseOutlined,
  ShopOutlined,
  TeamOutlined,
  TransactionOutlined,
  UserOutlined,
  MenuOutlined,
  BookOutlined,
  ControlOutlined,
  MailOutlined,
  MonitorOutlined,
  FileTextOutlined,
  ToolOutlined,
  FileOutlined,
  CodeOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  CopyrightOutlined,
  TagsOutlined,
  ShoppingOutlined,
  ReloadOutlined,
  GiftOutlined,
  TrophyOutlined,
  HistoryOutlined,
  SlidersOutlined,
  OrderedListOutlined,
  RollbackOutlined,
  SolutionOutlined,
  PartitionOutlined,
  NotificationOutlined,
  PhoneOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  LoginOutlined
} from '@ant-design/icons';

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
            // Parent: System
            {
              name: 'system',
              meta: {
                label: '系统管理',
                icon: <SettingOutlined />,
              },
            },
            {
              name: 'system/user',
              list: '/system/user',
              meta: {
                label: '用户管理',
                icon: <UserOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/role',
              list: '/system/role',
              meta: {
                label: '角色管理',
                icon: <TeamOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/menu',
              list: '/system/menu',
              meta: {
                label: '菜单管理',
                icon: <MenuOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/dict',
              list: '/system/dict',
              meta: {
                label: '字典管理',
                icon: <BookOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/config',
              list: '/system/config',
              meta: {
                label: '参数配置',
                icon: <ControlOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/notify-template',
              list: '/system/notify-template',
              meta: {
                label: '通知模板',
                icon: <MailOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/user-session',
              list: '/system/user-session',
              meta: {
                label: '在线用户',
                icon: <MonitorOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/posts',
              list: '/system/posts',
              meta: {
                label: '岗位管理',
                icon: <SolutionOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/dept',
              list: '/system/dept',
              meta: {
                label: '部门管理',
                icon: <PartitionOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/notice',
              list: '/system/notice',
              meta: {
                label: '通知公告',
                icon: <NotificationOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/sms',
              meta: {
                label: '短信管理',
                icon: <MessageOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/sms/channel',
              list: '/system/sms/channel',
              meta: {
                label: '短信渠道',
                icon: <PhoneOutlined />,
                parent: 'system/sms',
              },
            },
            {
              name: 'system/sms/template',
              list: '/system/sms/template',
              meta: {
                label: '短信模板',
                icon: <FileTextOutlined />,
                parent: 'system/sms',
              },
            },
            {
              name: 'system/sms/log',
              list: '/system/sms/log',
              meta: {
                label: '短信日志',
                icon: <HistoryOutlined />,
                parent: 'system/sms',
              },
            },
            {
              name: 'system/sms/code',
              list: '/system/sms/code',
              meta: {
                label: '验证码日志',
                icon: <SafetyCertificateOutlined />,
                parent: 'system/sms',
              },
            },
            {
              name: 'system/mail',
              meta: {
                label: '邮件管理',
                icon: <MailOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/mail/account',
              list: '/system/mail/account',
              meta: {
                label: '邮箱账号',
                icon: <UserOutlined />,
                parent: 'system/mail',
              },
            },
            {
              name: 'system/mail/template',
              list: '/system/mail/template',
              meta: {
                label: '邮件模板',
                icon: <FileTextOutlined />,
                parent: 'system/mail',
              },
            },
            {
              name: 'system/mail/log',
              list: '/system/mail/log',
              meta: {
                label: '邮件日志',
                icon: <HistoryOutlined />,
                parent: 'system/mail',
              },
            },
            {
              name: 'system/oauth2-client',
              list: '/system/oauth2-client',
              meta: {
                label: 'OAuth2 客户端',
                icon: <SafetyCertificateOutlined />,
                parent: 'system',
              },
            },
            {
              name: 'system/login-log',
              list: '/system/login-log',
              meta: {
                label: '登录日志',
                icon: <LoginOutlined />,
                parent: 'system',
              },
            },

            // Parent: Infra
            {
              name: 'infra',
              meta: {
                label: '基础设施',
                icon: <DatabaseOutlined />,
              },
            },
            {
              name: 'infra/file-config',
              list: '/infra/file-config',
              meta: {
                label: '文件配置',
                icon: <ToolOutlined />,
                parent: 'infra',
              },
            },
            {
              name: 'infra/file',
              list: '/infra/file',
              meta: {
                label: '文件列表',
                icon: <FileOutlined />,
                parent: 'infra',
              },
            },
            {
              name: 'infra/log',
              list: '/infra/log',
              meta: {
                label: '系统日志',
                icon: <FileTextOutlined />,
                parent: 'infra',
              },
            },
            {
              name: 'infra/codegen',
              list: '/infra/codegen',
              meta: {
                label: '代码生成',
                icon: <CodeOutlined />,
                parent: 'infra',
              },
            },
            {
              name: 'infra/job',
              list: '/infra/job',
              meta: {
                label: '定时任务',
                icon: <ScheduleOutlined />,
                parent: 'infra',
              },
            },

            // Parent: Mall
            {
              name: 'mall',
              meta: {
                label: '商城管理',
                icon: <ShopOutlined />,
              },
            },
            {
              name: 'mall/category',
              list: '/mall/category',
              meta: {
                label: '商品分类',
                icon: <AppstoreOutlined />,
                parent: 'mall',
              },
            },
            {
              name: 'mall/brand',
              list: '/mall/brand',
              meta: {
                label: '商品品牌',
                icon: <CopyrightOutlined />,
                parent: 'mall',
              },
            },
            {
              name: 'mall/property',
              list: '/mall/property',
              meta: {
                label: '规格管理',
                icon: <TagsOutlined />,
                parent: 'mall',
              },
            },
            {
              name: 'mall/spu',
              list: '/mall/spu',
              meta: {
                label: '商品列表',
                icon: <ShoppingOutlined />,
                parent: 'mall',
              },
            },
            {
              name: 'mall/order',
              list: '/mall/order',
              meta: {
                label: '订单管理',
                icon: <FileTextOutlined />,
                parent: 'mall',
              },
            },
            {
              name: 'mall/refund',
              list: '/mall/order-refund',
              meta: {
                label: '退款售后',
                icon: <ReloadOutlined />,
                parent: 'mall',
              },
            },
            {
              name: 'mall/coupon',
              list: '/mall/coupon',
              meta: {
                label: '优惠券管理',
                icon: <GiftOutlined />,
                parent: 'mall',
              },
            },

            // Parent: Member
            {
              name: 'member',
              meta: {
                label: '会员管理',
                icon: <TeamOutlined />,
              },
            },
            {
              name: 'member/user',
              list: '/member/user',
              meta: {
                label: '会员列表',
                icon: <UserOutlined />,
                parent: 'member',
              },
            },
            {
              name: 'member/level',
              list: '/member/level',
              meta: {
                label: '会员等级',
                icon: <TrophyOutlined />,
                parent: 'member',
              },
            },
            {
              name: 'member/tag',
              list: '/member/tag',
              meta: {
                label: '会员标签',
                icon: <TagsOutlined />,
                parent: 'member',
              },
            },
            {
              name: 'member/sign-in-config',
              list: '/member/sign-in-config',
              meta: {
                label: '签到规则',
                icon: <ScheduleOutlined />,
                parent: 'member',
              },
            },
            {
              name: 'member/sign-in-record',
              list: '/member/sign-in-record',
              meta: {
                label: '签到记录',
                icon: <HistoryOutlined />,
                parent: 'member',
              },
            },

            // Parent: Pay
            {
              name: 'pay',
              meta: {
                label: '支付中心',
                icon: <TransactionOutlined />,
              },
            },
            {
              name: 'pay/app',
              list: '/pay/app',
              meta: {
                label: '支付应用',
                icon: <SlidersOutlined />,
                parent: 'pay',
              },
            },
            {
              name: 'pay/order',
              list: '/pay/order',
              meta: {
                label: '支付订单',
                icon: <OrderedListOutlined />,
                parent: 'pay',
              },
            },
            {
              name: 'pay/refund',
              list: '/pay/refund',
              meta: {
                label: '退款订单',
                icon: <RollbackOutlined />,
                parent: 'pay',
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
