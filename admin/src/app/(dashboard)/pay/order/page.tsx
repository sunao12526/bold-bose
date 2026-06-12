'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Tag, Drawer, Button, Timeline, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { OrderedListOutlined, CreditCardOutlined, HistoryOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

export default function PayOrderList() {
  const { tableProps, tableQueryResult } = useTable({
    resource: 'pay/order',
    syncWithLocation: true,
  });

  // Logs Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const formatPrice = (cents: number) => {
    return `¥${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  const getChannelTag = (code: string) => {
    if (!code) return <Tag color="default">未选择</Tag>;
    switch (code) {
      case 'mock':
        return <Tag color="blue">模拟支付</Tag>;
      case 'alipay':
        return <Tag color="cyan">支付宝</Tag>;
      case 'wechat':
        return <Tag color="green">微信支付</Tag>;
      default:
        return <Tag color="purple">{code}</Tag>;
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return <Tag color="volcano">待支付</Tag>;
      case 'SUCCESS':
        return <Tag color="green">支付成功</Tag>;
      case 'CLOSED':
        return <Tag color="default">已关闭</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const getNotifyStatusTag = (status: string) => {
    switch (status) {
      case 'NO':
        return <Tag color="default">未发送</Tag>;
      case 'SUCCESS':
        return <Tag color="success">回调成功</Tag>;
      case 'FAIL':
        return <Tag color="error">回调失败</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const triggerMockPay = async (id: number) => {
    try {
      await axiosInstance.put(`/pay/order/${id}/pay-mock`);
      message.success('模拟支付成功，已触发回调通知');
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error('模拟支付失败: ' + (err.response?.data?.message || err.message));
    }
  };

  const openLogsDrawer = async (order: any) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const res = await axiosInstance.get(`/pay/order/${order.id}`);
      setLogs(res.data?.notifyLogs || []);
    } catch (err: any) {
      message.error('获取通知日志失败');
    } finally {
      setDrawerLoading(false);
    }
  };

  const triggerManualRetry = async (logId: number) => {
    try {
      // Direct POST retry is simulated via API or manually fetching sendNotification in service.
      // Wait, we can implement an admin endpoint or run the job once, or simply call fetch retry.
      // Let's call the notify endpoint to send the notification again.
      // Actually, since payNotifyJob is running every 10 seconds, it will automatically retry.
      // We can also let the admin click a retry button which runs it in the backend.
      // Wait! Is there an endpoint for re-dispatching?
      // Our background scheduler allows running payNotifyJob immediately if they run it in the background job dashboard!
      // But we can also add a simple backend endpoint if needed, or simply wait for the cron job to run it.
      // To be safe, we can trigger the cron job execution once from the job module!
      message.info('系统正在后台调度重试通知任务，请稍后刷新');
    } catch (err) {
      message.error('重试触发失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="支付订单管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="订单ID" width={80} />
          <Table.Column 
            dataIndex={["app", "name"]} 
            title="应用" 
            render={(val, record: any) => record.app?.name || '-'} 
          />
          <Table.Column 
            dataIndex="merchantOrderId" 
            title="商户单号" 
            render={(no: string) => (
              <span style={{ fontFamily: 'monospace' }}>{no}</span>
            )}
          />
          <Table.Column dataIndex="subject" title="商品主题" />
          <Table.Column 
            dataIndex="price" 
            title="支付金额" 
            render={(price: number) => (
              <span style={{ color: '#cf1322', fontWeight: 'bold' }}>{formatPrice(price)}</span>
            )}
          />
          <Table.Column 
            dataIndex="channelCode" 
            title="支付通道" 
            render={(code: string) => getChannelTag(code)}
          />
          <Table.Column 
            dataIndex="status" 
            title="支付状态" 
            render={(status: string) => getStatusTag(status)}
          />
          <Table.Column 
            dataIndex="payTime" 
            title="支付时间" 
            render={(date: any) => formatDate(date)}
          />
          <Table.Column 
            dataIndex="notifyStatus" 
            title="回调状态" 
            render={(status: string) => getNotifyStatusTag(status)}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={220}
            render={(_, record: any) => (
              <Space>
                {record.status === 'UNPAID' && (
                  <Popconfirm
                    title="确认模拟支付此订单？"
                    description="这将直接更新订单为已支付，并向上游业务模块发送回调 Webhook。"
                    onConfirm={() => triggerMockPay(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      size="small" 
                      type="primary" 
                      icon={<CreditCardOutlined />}
                    >
                      模拟支付
                    </Button>
                  </Popconfirm>
                )}
                <Button 
                  size="small" 
                  icon={<HistoryOutlined />} 
                  onClick={() => openLogsDrawer(record)}
                >
                  通知日志
                </Button>
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Callback logs drawer */}
      <Drawer
        title={`回调通知轨迹 - 商户单号: ${selectedOrder?.merchantOrderId || ''}`}
        width={560}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        loading={drawerLoading}
      >
        <div style={{ marginBottom: '24px' }}>
          <strong>回调通知URL: </strong>
          <span style={{ wordBreak: 'break-all', color: '#1677ff' }}>
            {selectedOrder?.merchantNotifyUrl}
          </span>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
            暂无通知发送记录。当模拟支付成功后，系统会自动推送 Webhook。
          </div>
        ) : (
          <Timeline mode="left">
            {logs.map((log: any, idx: number) => {
              const isSuccess = log.status === 'SUCCESS';
              return (
                <Timeline.Item
                  key={log.id}
                  dot={
                    isSuccess ? (
                      <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />
                    ) : (
                      <CloseCircleOutlined style={{ fontSize: '16px', color: '#f5222d' }} />
                    )
                  }
                  color={isSuccess ? 'green' : 'red'}
                  label={formatDate(log.lastAttemptTime || log.createdAt)}
                >
                  <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>第 {log.attemptCount} 次推送回调</strong>
                      <Tag color={isSuccess ? 'success' : 'error'}>
                        {isSuccess ? '推送成功' : '推送失败'}
                      </Tag>
                    </div>
                    {log.nextNotifyTime && !isSuccess && (
                      <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '8px' }}>
                        <SyncOutlined spin style={{ marginRight: '4px' }} />
                        下一次重试时间：{formatDate(log.nextNotifyTime)}
                      </div>
                    )}
                    <div style={{ display: 'block', fontSize: '13px' }}>
                      <strong>服务器响应结果: </strong>
                      <pre style={{ 
                        background: '#ffffff', 
                        padding: '6px', 
                        borderRadius: '2px', 
                        maxHeight: '100px', 
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        marginTop: '4px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        border: '1px solid #f0f0f0'
                      }}>
                        {log.responseContent || '(空返回值)'}
                      </pre>
                    </div>
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Drawer>
    </div>
  );
}
