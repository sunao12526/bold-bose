'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Switch } from 'antd';
import { useTable, useForm } from '@refinedev/antd';

export default function ConfigList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/config',
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
    resource: 'system/config',
    action: formMode,    onMutationSuccess: () => {
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
          <Table.Column dataIndex="name" title="参数名称" />
          <Table.Column dataIndex="key" title="参数键名" />
          <Table.Column dataIndex="value" title="参数键值" />
          <Table.Column 
            dataIndex="visible" 
            title="系统内置" 
            render={(visible: boolean) => (
              <Tag color={visible ? 'blue' : 'gray'}>
                {visible ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column dataIndex="remark" title="备注" ellipsis />
          <Table.Column
            title="操作"
            dataIndex="actions"
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
        title={formMode === 'create' ? '新增参数配置' : '编辑参数配置'}
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
            label="参数名称"
            rules={[{ required: true, message: '请输入参数名称' }]}
          >
            <Input placeholder="例如：用户注册验证码开关" />
          </Form.Item>

          <Form.Item
            name="key"
            label="参数键名"
            rules={[{ required: true, message: '请输入参数键名' }]}
          >
            <Input disabled={formMode === 'edit'} placeholder="例如：sys.user.captcha.enable" />
          </Form.Item>

          <Form.Item
            name="value"
            label="参数键值"
            rules={[{ required: true, message: '请输入参数键值' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入参数键值" />
          </Form.Item>

          <Form.Item name="visible" label="系统内置" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
