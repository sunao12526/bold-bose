'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Select, Tag, Button, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { EditOutlined, ScheduleOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

export default function SignInConfigList() {
  const { tableProps, tableQuery } = useTable({
    resource: 'member/sign-in-config',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (record: any) => {
    setSelectedConfig(record);
    form.setFieldsValue({
      point: record.point,
      status: record.status || 'ENABLE'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    if (!selectedConfig) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/member/sign-in/config/${selectedConfig.day}`, {
        point: values.point,
        status: values.status
      });
      message.success('修改签到奖励规则成功');
      setIsModalOpen(false);
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存规则失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="签到奖励规则配置">
        <Table {...tableProps} rowKey="id" pagination={false}>
          <Table.Column 
            dataIndex="day" 
            title="连续签到天数" 
            width={150}
            render={(day: number) => (
              <Space>
                <ScheduleOutlined style={{ color: '#52c41a' }} />
                <span style={{ fontWeight: '600' }}>第 {day} 天</span>
              </Space>
            )}
          />
          <Table.Column 
            dataIndex="point" 
            title="赠送积分额度" 
            width={200}
            render={(point: number) => (
              <span style={{ color: '#d46b08', fontWeight: 'bold', fontSize: '15px' }}>
                +{point} 分
              </span>
            )}
          />
          <Table.Column 
            dataIndex="status" 
            title="规则状态" 
            width={150}
            render={(status: string) => (
              <Tag color={status === 'ENABLE' ? 'green' : 'red'}>
                {status === 'ENABLE' ? '启用' : '禁用'}
              </Tag>
            )}
          />
          <Table.Column title="说明" render={(_, record: any) => `连续签到第 ${record.day} 天，可获得 ${record.point} 积分奖励。`} />
          <Table.Column
            title="操作"
            key="action"
            width={120}
            render={(_, record: any) => (
              <Button 
                type="link" 
                size="small" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)}
              >
                配置奖励
              </Button>
            )}
          />
        </Table>
      </List>

      <Modal
        title={selectedConfig ? `配置第 ${selectedConfig.day} 天签到奖励` : '配置签到奖励'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="point"
            label="赠送积分奖励值"
            rules={[{ required: true, message: '请配置赠送积分数值' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
