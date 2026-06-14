'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function UserList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/user',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();
  
  const { selectProps: roleSelectProps } = useSelect({
    resource: 'system/role',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const { selectProps: deptSelectProps } = useSelect({
    resource: 'system/dept',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.setFieldsValue({
      ...record,
      deptId: record.deptId || null,
      roleIds: record.roles?.map((ur: any) => ur.role.id) || [],
    });
    setIsModalOpen(true);
  };

  const { onFinish, formLoading } = useForm({
    resource: 'system/user',
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
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="username" title="用户名" />
          <Table.Column dataIndex="nickname" title="昵称" />
          <Table.Column dataIndex="email" title="邮箱" />
          <Table.Column dataIndex="mobile" title="手机号" />
          <Table.Column 
            dataIndex="dept" 
            title="部门" 
            render={(dept: any) => dept ? <Tag color="cyan">{dept.name}</Tag> : '-'}
          />
          <Table.Column 
            dataIndex="roles" 
            title="角色" 
            render={(roles: any[]) => (
              <>
                {roles?.map((ur) => (
                  <Tag color="blue" key={ur.role.id}>{ur.role.name}</Tag>
                ))}
              </>
            )}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            render={(status: string) => (
              <Tag color={status === 'ENABLE' ? 'green' : 'red'}>
                {status === 'ENABLE' ? '启用' : '禁用'}
              </Tag>
            )}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
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
        title={formMode === 'create' ? '新增用户' : '编辑用户'}
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
            if (payload.deptId) {
              payload.deptId = Number(payload.deptId);
            }
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled={formMode === 'edit'} />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: formMode === 'create', message: '请输入密码' }]}
          >
            <Input.Password placeholder={formMode === 'edit' ? '留空表示不修改' : '请输入密码'} />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>

          <Form.Item name="mobile" label="手机号">
            <Input />
          </Form.Item>

          <Form.Item name="deptId" label="部门">
            <Select placeholder="请选择部门" allowClear {...deptSelectProps} />
          </Form.Item>

          <Form.Item name="roleIds" label="角色">
            <Select mode="multiple" placeholder="请选择角色" {...roleSelectProps} />
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
