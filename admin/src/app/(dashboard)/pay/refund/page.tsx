'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Tag, Drawer, Button, Timeline, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { RollbackOutlined, CreditCardOutlined, HistoryOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

export default function PayRefundList() {
  const { tableProps, tableQueryResult } = useTable({
    resource: 'pay/refund',
    syncWithLocation: true,
  });

  // Logs Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const formatPrice = (cents: number) => {
    return `¥${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'APPLY':
        return <Tag color="gold">退款中</Tag>;
      case 'SUCCESS':
        return <Tag color="green">退款成功</Tag>;
      case 'CLOSED':
        return <Tag color="default">已关闭</Tag>;
      case 'FAIL':
        return <Tag color="error">退款失败</Tag>;
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

  const triggerMockRefund = async (id: number) => {
    try {
      await axiosInstance.put(`/pay/refund/${id}/refund-mock`);
      message.success('模拟退款成功，已触发回调通知');
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error('模拟退款失败: ' + (err.response?.data?.message || err.message));
    }
  };

  const openLogsDrawer = async (refund: any) => {
    setSelectedRefund(refund);
    setIsDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const res = await axiosInstance.get(`/pay/refund/${refund.id}`);
      setLogs(res.data?.notifyLogs || []);
    } catch (err: any) {
      message.error('获取通知日志失败');
    } finally {
      setDrawerLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="退款订单管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="退款ID" width={80} />
          <Table.Column 
            dataIndex={["payOrder", "merchantOrderId"]} 
            title="商户单号" 
            render={(val, record: any) => record.payOrder?.merchantOrderId || '-'} 
          />
          <Table.Column 
            dataIndex="merchantRefundId" 
            title="商户退款单号" 
            render={(no: string) => (
              <span style={{ fontFamily: 'monospace' }}>{no}</span>
            )}
          />
          <Table.Column 
            dataIndex={["payOrder", "subject"]} 
            title="商品主题" 
            render={(val, record: any) => record.payOrder?.subject || '-'} 
          />
          <Table.Column 
            dataIndex="price" 
            title="原订单金额" 
            render={(price: number) => formatPrice(price)}
          />
          <Table.Column 
            dataIndex="refundPrice" 
            title="退款金额" 
            render={(refundPrice: number) => (
              <span style={{ color: '#389e0d', fontWeight: 'bold' }}>{formatPrice(refundPrice)}</span>
            )}
          />
          <Table.Column dataIndex="reason" title="退款原因" />
          <Table.Column 
            dataIndex="status" 
            title="退款状态" 
            render={(status: string) => getStatusTag(status)}
          />
          <Table.Column 
            dataIndex="refundTime" 
            title="退款完成时间" 
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
                {record.status === 'APPLY' && (
                  <Popconfirm
                    title="确认模拟退款处理？"
                    description="这将直接更新退款单为已退款成功，并向上游业务模块发送回调 Webhook。"
                    onConfirm={() => triggerMockRefund(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      size="small" 
                      type="primary" 
                      danger
                      icon={<RollbackOutlined />}
                    >
                      模拟退款
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
        title={`回调通知轨迹 - 商户退款单号: ${selectedRefund?.merchantRefundId || ''}`}
        width={560}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        loading={drawerLoading}
      >
        <div style={{ marginBottom: '24px' }}>
          <strong>回调通知URL: </strong>
          <span style={{ wordBreak: 'break-all', color: '#1677ff' }}>
            {selectedRefund?.merchantNotifyUrl}
          </span>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
            暂无通知发送记录。当模拟退款处理成功后，系统会自动推送 Webhook。
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
