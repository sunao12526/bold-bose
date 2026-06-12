'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Switch } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function PostsList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/posts',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  // Load Dictionary Option Select Props
  const { selectProps: statusSelectProps } = useSelect({
    resource: 'system/dict-data',
    optionLabel: 'label',
    optionValue: 'value',
    filters: [{ field: 'dictType', operator: 'eq', value: 'sys_common_status' }],
  });


  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.resetFields();
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const { onFinish, formLoading } = useForm({
    resource: 'system/posts',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
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
          <Table.Column dataIndex="title" title="title" ellipsis />
          <Table.Column dataIndex="content" title="content" ellipsis />
          <Table.Column 
            dataIndex="status" 
            title="status" 
            render={(val: string) => (
              <Tag color={val === 'ENABLE' ? 'green' : 'red'}>{val === 'ENABLE' ? '启用' : '禁用'}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="created_at" 
            title="created_at" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={120}
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增system_posts' : '编辑system_posts'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            // Convert numerical inputs
            const payload = { ...values };
            Object.keys(payload).forEach(key => {
              const rules = form.getFieldInstance(key)?.props?.type;
              if (rules === 'number' && payload[key] !== undefined) {
                payload[key] = Number(payload[key]);
              }
            });
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="title" label="title" rules={[{ required: true, message: '请输入title' }]}>
            <Input placeholder="请输入title" />
          </Form.Item>

          <Form.Item name="content" label="content" >
            <Input.TextArea rows={3} placeholder="请输入content" />
          </Form.Item>

          <Form.Item name="status" label="status"  initialValue="ENABLE">
            <Select placeholder="请选择status" {...statusSelectProps} />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}
