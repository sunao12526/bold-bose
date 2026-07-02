'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { Card, Space, Select, Col, Row, Statistic, Spin, Alert } from 'antd';
import { UserAddOutlined, UserDeleteOutlined, UsergroupAddOutlined, MessageOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { axiosInstance } from '../../../../lib/axios';

export default function MpStatistics() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  
  const [userSummary, setUserSummary] = React.useState<any[]>([]);
  const [msgSummary, setMsgSummary] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // 1. 获取所有公众号账号
  React.useEffect(() => {
    axiosInstance.get('/mp/account').then((res: any) => {
      const data = res.data?.data || res.data || [];
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    });
  }, []);

  // 2. 加载统计报表数据
  const loadData = async (accountId: number) => {
    setLoading(true);
    try {
      const [resUser, resMsg] = await Promise.all([
        axiosInstance.get(`/mp/statistics/user-summary?accountId=${accountId}&days=7`),
        axiosInstance.get(`/mp/statistics/message-summary?accountId=${accountId}&days=7`),
      ]);
      setUserSummary(resUser.data?.data || resUser.data || []);
      setMsgSummary(resMsg.data?.data || resMsg.data || []);
    } catch {
      // 容错处理
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedAccountId !== null) {
      loadData(selectedAccountId);
    }
  }, [selectedAccountId]);

  // 计算今日/最近一日的数据作为指标卡片内容
  const latestUser = userSummary[userSummary.length - 1] || { newUser: 0, cancelUser: 0, netGrowUser: 0 };
  const latestMsg = msgSummary[msgSummary.length - 1] || { userMsgCount: 0, sysMsgCount: 0 };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>当前选择的微信公众号：</span>
        <Select
          style={{ width: 220 }}
          placeholder="请选择公众号"
          value={selectedAccountId}
          onChange={(v) => setSelectedAccountId(v)}
          options={accounts.map((a) => ({ label: a.name, value: a.id }))}
        />
      </div>

      <Spin spinning={loading}>
        {/* 指标卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Statistic
                title="今日新增关注"
                value={latestUser.newUser}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<UserAddOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Statistic
                title="今日取消关注"
                value={latestUser.cancelUser}
                precision={0}
                valueStyle={{ color: '#cf1322' }}
                prefix={<UserDeleteOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Statistic
                title="今日净增粉丝"
                value={latestUser.netGrowUser}
                precision={0}
                valueStyle={{ color: latestUser.netGrowUser >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={<UsergroupAddOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Statistic
                title="今日粉丝上行消息数"
                value={latestMsg.userMsgCount}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 趋势图表 */}
        <Row gutter={24}>
          <Col span={12}>
            <Card title="最近 7 天粉丝变动变动趋势" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <AreaChart data={userSummary} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="refDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="newUser" name="新关注" stroke="#52c41a" fill="#f6ffed" />
                    <Area type="monotone" dataKey="cancelUser" name="取消关注" stroke="#ff4d4f" fill="#fff1f0" />
                    <Area type="monotone" dataKey="netGrowUser" name="净增关注" stroke="#1890ff" fill="#e6f7ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card title="最近 7 天消息互动趋势" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={msgSummary} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="refDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="userMsgCount" name="粉丝上行消息" stroke="#722ed1" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="sysMsgCount" name="系统客服回复" stroke="#fa8c16" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
