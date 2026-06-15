'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function OAuth2ClientList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/oauth2-client',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
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
    
    // Parse JSON string fields to form inputs
    let redirectUrisText = '';
    let scopesText = '';
    try {
      redirectUrisText = JSON.parse(record.redirectUris).join('\n');
    } catch {
      redirectUrisText = record.redirectUris;
    }
    try {
      scopesText = JSON.parse(record.scopes).join(',');
    } catch {
      scopesText = record.scopes;
    }

    form.setFieldsValue({
      ...record,
      redirectUris: redirectUrisText,
      scopes: scopesText,
    });
    setIsModalOpen(true);
  };

  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'system/oauth2-client',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  const renderJsonTags = (val: string) => {
    try {
      const arr = JSON.parse(val);
      if (!Array.isArray(arr)) return val;
      return (
        <Space size={[0, 4]} wrap>
          {arr.map((item: string) => (
            <Tag key={item} color="blue">{item}</Tag>
          ))}
        </Space>
      );
    } catch {
      return val;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="编号" width={80} />
          <Table.Column dataIndex="name" title="客户端名称" />
          <Table.Column dataIndex="clientId" title="Client ID" />
          <Table.Column dataIndex="secret" title="Client Secret" />
          <Table.Column 
            dataIndex="redirectUris" 
            title="回调地址" 
            render={renderJsonTags}
            ellipsis
          />
          <Table.Column 
            dataIndex="scopes" 
            title="授权范围" 
            render={renderJsonTags}
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

      <Modal forceRender
        title={formMode === 'create' ? '新增 OAuth2 客户端' : '编辑 OAuth2 客户端'}
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
            // Format inputs to JSON string arrays
            const uris = values.redirectUris 
              ? values.redirectUris.split('\n').map((x: string) => x.trim()).filter(Boolean)
              : [];
            const scopes = values.scopes 
              ? values.scopes.split(',').map((x: string) => x.trim()).filter(Boolean)
              : [];
            payload.redirectUris = JSON.stringify(uris);
            payload.scopes = JSON.stringify(scopes);
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="name" label="客户端名称" rules={[{ required: true, message: '请输入客户端名称' }]}>
            <Input placeholder="请输入客户端名称" />
          </Form.Item>

          <Form.Item name="clientId" label="Client ID" rules={[{ required: true, message: '请输入 Client ID' }]}>
            <Input placeholder="请输入 Client ID" />
          </Form.Item>

          <Form.Item name="secret" label="Client Secret" rules={[{ required: true, message: '请输入 Client Secret' }]}>
            <Input placeholder="请输入 Client Secret" />
          </Form.Item>

          <Form.Item name="redirectUris" label="回调地址 (每行一个)" rules={[{ required: true, message: '请输入回调地址' }]}>
            <Input.TextArea rows={3} placeholder="请输入允许重定向的回调地址，例如：&#10;http://localhost:3001/sso-callback" />
          </Form.Item>

          <Form.Item name="scopes" label="授权范围 (英文逗号分隔)" rules={[{ required: true, message: '请输入授权范围' }]} initialValue="user_info">
            <Input placeholder="例如: user_info,roles" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select placeholder="请选择状态" {...statusSelectProps} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
