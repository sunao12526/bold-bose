'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Select, Tag } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { TrophyOutlined } from '@ant-design/icons';

export default function LevelList() {
  const { tableProps } = useTable({
    resource: 'member/level',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'member/level',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  return (
    <div style={{ padding: '24px' }}>
      <List
        title="会员等级"
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="name" 
            title="等级名称" 
            render={(name: string) => (
              <Space>
                <TrophyOutlined style={{ color: '#fa8c16' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column dataIndex="level" title="等级级别 (数字)" width={150} />
          <Table.Column 
            dataIndex="experience" 
            title="升级所需成长值" 
            width={180}
            render={(val: number) => (
              <span style={{ fontWeight: '600', color: '#722ed1' }}>{val}</span>
            )}
          />
          <Table.Column 
            dataIndex="discountPercent" 
            title="享受折扣" 
            width={150}
            render={(val: number) => val === 100 ? '无折扣' : `${(val / 10).toFixed(1)} 折`}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={120}
            render={(status: string) => (
              <Tag color={status === 'ENABLE' ? 'green' : 'red'}>
                {status === 'ENABLE' ? '启用' : '禁用'}
              </Tag>
            )}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={160}
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增会员等级' : '编辑会员等级'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onFinish(values);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="name"
            label="等级名称"
            rules={[{ required: true, message: '请输入等级名称' }]}
          >
            <Input placeholder="例：黄金会员" />
          </Form.Item>

          <Form.Item
            name="level"
            label="等级级别 (数字，例: 1, 2, 3，数字越大等级越高)"
            rules={[{ required: true, message: '请输入等级级别数值' }]}
          >
            <InputNumber min={1} precision={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="experience"
            label="升级所需成长值"
            rules={[{ required: true, message: '请输入升级所需成长值' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="例: 1000 表示达到该数值自动升入此级" />
          </Form.Item>

          <Form.Item
            name="discountPercent"
            label="专享折扣百分比 (1-100, 例: 95 表示 9.5折，100为无折扣)"
            rules={[
              { required: true, message: '请输入专享折扣百分比' },
              { type: 'number', min: 1, max: 100, message: '折扣范围在 1 到 100 之间' }
            ]}
          >
            <InputNumber min={1} max={100} precision={0} style={{ width: '100%' }} />
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
