'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Select, Tag } from 'antd';
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
          <Table.Column dataIndex="id" title="岗位编号" width={100} />
          <Table.Column dataIndex="name" title="岗位名称" ellipsis />
          <Table.Column dataIndex="code" title="岗位编码" ellipsis />
          <Table.Column dataIndex="sort" title="显示顺序" width={100} />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            render={(val: string) => (
              <Tag color={val === 'ENABLE' ? 'green' : 'red'}>{val === 'ENABLE' ? '启用' : '禁用'}</Tag>
            )}
          />
          <Table.Column dataIndex="remark" title="备注" ellipsis />
          <Table.Column 
            dataIndex="createdAt" 
            title="创建时间" 
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
        title={formMode === 'create' ? '新增岗位' : '编辑岗位'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = { ...values };
            if (payload.sort !== undefined) {
              payload.sort = Number(payload.sort);
            }
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="name" label="岗位名称" rules={[{ required: true, message: '请输入岗位名称' }]}>
            <Input placeholder="请输入岗位名称" />
          </Form.Item>

          <Form.Item name="code" label="岗位编码" rules={[{ required: true, message: '请输入岗位编码' }]}>
            <Input placeholder="请输入岗位编码" />
          </Form.Item>

          <Form.Item name="sort" label="岗位顺序" rules={[{ required: true, message: '请输入显示顺序' }]} initialValue={1}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入显示顺序" min={0} />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select placeholder="请选择状态" {...statusSelectProps} />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注内容" />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
}
