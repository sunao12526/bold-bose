'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Tag, Button, Image, Descriptions, Divider, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { ReloadOutlined, AuditOutlined, EyeOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

interface RefundRecord {
  id: number;
  no: string;
  orderId: number;
  memberId: number;
  refundPrice: number;
  status: 'APPLY' | 'APPROVED' | 'REJECTED';
  reason: string;
  userRemark?: string;
  auditRemark?: string;
  auditTime?: string;
  createdAt: string;
  order: {
    no: string;
    receiverName: string;
    receiverMobile: string;
    items: any[];
  };
}

export default function RefundList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable<RefundRecord>({
    resource: 'mall/refund',
    syncWithLocation: true,
  });

  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const [selectedRefund, setSelectedRefund] = useState<RefundRecord | null>(null);
  
  const [auditForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const openAuditModal = (record: RefundRecord) => {
    setSelectedRefund(record);
    auditForm.resetFields();
    setAuditModalOpen(true);
  };

  const openDetailsModal = (record: RefundRecord) => {
    setSelectedRefund(record);
    setDetailsModalOpen(true);
  };

  const handleAudit = async (action: 'approve' | 'reject') => {
    if (!selectedRefund) return;
    
    try {
      const values = await auditForm.validateFields();
      setSubmitting(true);
      
      if (action === 'approve') {
        await axiosInstance.put(`/mall/refund/${selectedRefund.id}/approve`, {
          auditRemark: values.auditRemark,
        });
        message.success('已同意退款');
      } else {
        if (!values.auditRemark || values.auditRemark.trim() === '') {
          auditForm.setFields([
            {
              name: 'auditRemark',
              errors: ['拒绝退款时，审核备注不能为空'],
            },
          ]);
          setSubmitting(false);
          return;
        }
        await axiosInstance.put(`/mall/refund/${selectedRefund.id}/reject`, {
          auditRemark: values.auditRemark,
        });
        message.success('已拒绝退款');
      }
      
      setAuditModalOpen(false);
      tableQueryResult.refetch();
    } catch (err: any) {
      if (err.name !== 'ValidationError') {
        message.error(err.response?.data?.message || '审核操作失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const statusMapper = {
    APPLY: { color: 'gold', text: '待审核' },
    APPROVED: { color: 'green', text: '退款成功' },
    REJECTED: { color: 'red', text: '已拒绝' },
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="退款售后管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="no" title="退款编号" width={160} />
          <Table.Column dataIndex={['order', 'no']} title="关联订单" width={160} />
          <Table.Column 
            dataIndex="refundPrice" 
            title="申请退款金额" 
            width={120}
            render={(val: number) => (
              <span style={{ color: '#cf1322', fontWeight: '600' }}>
                ¥{(val / 100).toFixed(2)}
              </span>
            )}
          />
          <Table.Column dataIndex="reason" title="退款原因" />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={120}
            render={(status: keyof typeof statusMapper) => (
              <Tag color={statusMapper[status]?.color}>{statusMapper[status]?.text}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="申请时间" 
            width={160}
            render={(val: string) => new Date(val).toLocaleString()}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={160}
            render={(_, record: RefundRecord) => (
              <Space>
                <Button 
                  size="small" 
                  icon={<EyeOutlined />} 
                  onClick={() => openDetailsModal(record)}
                >
                  详情
                </Button>
                {record.status === 'APPLY' && (
                  <Button 
                    size="small" 
                    type="primary"
                    icon={<AuditOutlined />} 
                    onClick={() => openAuditModal(record)}
                  >
                    审核
                  </Button>
                )}
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Refund Details Modal */}
      <Modal
        title={`退款申请详情 [${selectedRefund?.no}]`}
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalOpen(false)}>关闭</Button>
        ]}
        width={650}
      >
        {selectedRefund && (
          <div>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="退款编号" span={2}>{selectedRefund.no}</Descriptions.Item>
              <Descriptions.Item label="关联订单">{selectedRefund.order?.no}</Descriptions.Item>
              <Descriptions.Item label="退款金额">
                <strong style={{ color: '#cf1322' }}>¥{(selectedRefund.refundPrice / 100).toFixed(2)}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <Tag color={statusMapper[selectedRefund.status]?.color}>{statusMapper[selectedRefund.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">{new Date(selectedRefund.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="退款原因" span={2}>{selectedRefund.reason}</Descriptions.Item>
              <Descriptions.Item label="用户备注" span={2}>{selectedRefund.userRemark || '-'}</Descriptions.Item>
            </Descriptions>

            {selectedRefund.status !== 'APPLY' && (
              <>
                <Divider style={{ margin: '12px 0' }} />
                <Descriptions title="审核结果" bordered size="small" column={2}>
                  <Descriptions.Item label="审核时间" span={2}>{selectedRefund.auditTime ? new Date(selectedRefund.auditTime).toLocaleString() : '-'}</Descriptions.Item>
                  <Descriptions.Item label="审核备注" span={2}>{selectedRefund.auditRemark || '-'}</Descriptions.Item>
                </Descriptions>
              </>
            )}

            <Divider style={{ margin: '12px 0' }} />
            <h4 style={{ marginBottom: 8 }}>退款关联商品</h4>
            <Table dataSource={selectedRefund.order?.items} pagination={false} rowKey="id" size="small">
              <Table.Column 
                dataIndex="picUrl" 
                title="商品图片" 
                width={60}
                render={(url: string) => <Image src={url} alt="商品" width={30} height={30} style={{ objectFit: 'cover', borderRadius: '4px' }} />}
              />
              <Table.Column dataIndex="spuName" title="商品名称" />
              <Table.Column 
                dataIndex="properties" 
                title="规格属性" 
                render={(props: any[]) => props?.map((p: any) => `${p.propertyName}: ${p.valueName}`).join(' | ') || '-'}
              />
              <Table.Column 
                dataIndex="price" 
                title="单价" 
                render={(val: number) => `¥${(val / 100).toFixed(2)}`}
              />
              <Table.Column dataIndex="count" title="数量" width={60} />
            </Table>
          </div>
        )}
      </Modal>

      {/* Audit Modal */}
      <Modal forceRender
        title={`退款申请审核 [${selectedRefund?.no}]`}
        open={auditModalOpen}
        onCancel={() => setAuditModalOpen(false)}
        confirmLoading={submitting}
        footer={[
          <Button key="back" onClick={() => setAuditModalOpen(false)}>取消</Button>,
          <Button 
            key="reject" 
            danger 
            onClick={() => handleAudit('reject')}
            loading={submitting}
          >
            拒绝退款
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={() => handleAudit('approve')}
            loading={submitting}
          >
            同意退款
          </Button>
        ]}
      >
        {selectedRefund && (
          <div style={{ marginBottom: 16 }}>
            <div>申请退款金额：<strong style={{ color: '#cf1322' }}>¥{(selectedRefund.refundPrice / 100).toFixed(2)}</strong></div>
            <div>退款原因：<strong>{selectedRefund.reason}</strong></div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: 4 }}>
              * 注意：同意退款后，退款金额将原路返还至会员 [张三] 的账户余额中，且该订单将自动关闭。
            </div>
          </div>
        )}
        <Form
          form={auditForm}
          layout="vertical"
        >
          <Form.Item
            name="auditRemark"
            label="审核备注/意见"
            rules={[{ required: false }]}
          >
            <Input.TextArea placeholder="请输入审批备注（拒绝退款时，此项必填）" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
