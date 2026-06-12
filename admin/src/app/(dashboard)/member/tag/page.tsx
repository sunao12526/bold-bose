'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { TagsOutlined } from '@ant-design/icons';

export default function TagList() {
  const { tableProps } = useTable({
    resource: 'member/tag',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

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

  const { onFinish, formLoading } = useForm({
    resource: 'member/tag',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  return (
    <div style={{ padding: '24px' }}>
      <List
        title="会员标签"
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="name" 
            title="标签名称" 
            render={(name: string) => (
              <Space>
                <TagsOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column dataIndex="description" title="描述描述" />
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
        title={formMode === 'create' ? '新增会员标签' : '编辑会员标签'}
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
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="例：高客单价" />
          </Form.Item>

          <Form.Item
            name="description"
            label="标签描述"
          >
            <Input.TextArea rows={3} placeholder="请输入关于该会员群体的特征描述" />
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
