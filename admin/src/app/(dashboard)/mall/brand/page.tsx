'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Image } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { CopyrightOutlined } from '@ant-design/icons';

export default function BrandList() {
  const { tableProps } = useTable({
    resource: 'mall/brand',
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
    resource: 'mall/brand',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="name" 
            title="品牌名称" 
            render={(name: string) => (
              <Space>
                <CopyrightOutlined style={{ color: '#eb2f96' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column 
            dataIndex="logo" 
            title="品牌 LOGO" 
            render={(url: string) => url ? (
              <Image 
                src={url} 
                alt="LOGO" 
                width={50} 
                height={30} 
                style={{ objectFit: 'contain', background: '#f5f5f5', padding: '2px', borderRadius: '4px' }}
                fallback="https://placehold.co/100x60?text=No+Logo"
              />
            ) : <span style={{ color: '#ccc' }}>-</span>}
          />
          <Table.Column dataIndex="sort" title="排序" width={100} />
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
          <Table.Column dataIndex="remark" title="备注" />
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
        title={formMode === 'create' ? '新增品牌' : '编辑品牌'}
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
            label="品牌名称"
            rules={[{ required: true, message: '请输入品牌名称' }]}
          >
            <Input placeholder="请输入品牌名称" />
          </Form.Item>

          <Form.Item 
            name="logo" 
            label="品牌 LOGO URL"
          >
            <Input placeholder="请输入图片 URL（如 /brand/apple.png）" />
          </Form.Item>

          <Form.Item name="sort" label="显示排序" initialValue={0}>
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
