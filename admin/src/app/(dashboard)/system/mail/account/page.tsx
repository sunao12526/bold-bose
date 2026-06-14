'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Select, Tag, Switch } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function MailAccountList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/mail/account',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

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
    resource: 'system/mail/account',
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
          <Table.Column dataIndex="id" title="账号编号" width={100} />
          <Table.Column dataIndex="mail" title="邮箱地址" />
          <Table.Column dataIndex="host" title="SMTP 服务器" />
          <Table.Column dataIndex="port" title="端口" width={80} />
          <Table.Column 
            dataIndex="ssl" 
            title="SSL" 
            render={(val: boolean) => (
              <Tag color={val ? 'blue' : 'default'}>{val ? '是' : '否'}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            render={(val: string) => (
              <Tag color={val === 'ENABLE' ? 'green' : 'red'}>{val === 'ENABLE' ? '启用' : '禁用'}</Tag>
            )}
          />
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
        title={formMode === 'create' ? '新增邮箱账号' : '编辑邮箱账号'}
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
            payload.port = Number(payload.port);
            payload.ssl = payload.ssl === true;
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="mail" label="邮箱地址" rules={[{ required: true, message: '请输入邮箱地址', type: 'email' }]}>
            <Input placeholder="请输入邮箱地址 (如 test@163.com)" />
          </Form.Item>

          <Form.Item name="host" label="SMTP 服务器" rules={[{ required: true, message: '请输入 SMTP 服务器' }]}>
            <Input placeholder="请输入 SMTP 服务器地址 (如 smtp.163.com)" />
          </Form.Item>

          <Form.Item name="port" label="SMTP 端口" rules={[{ required: true, message: '请输入端口' }]} initialValue={465}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入端口" min={1} />
          </Form.Item>

          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入发送邮箱账号用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item name="password" label="授权码/密码" rules={[{ required: true, message: '请输入密码或授权码' }]}>
            <Input.Password placeholder="请输入密码或授权码" />
          </Form.Item>

          <Form.Item name="ssl" label="开启 SSL" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select placeholder="请选择状态" {...statusSelectProps} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
