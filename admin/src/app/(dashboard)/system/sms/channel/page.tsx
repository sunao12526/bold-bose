'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function SmsChannelList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/sms/channel',
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
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'system/sms/channel',
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
          <Table.Column dataIndex="id" title="渠道编号" width={100} />
          <Table.Column dataIndex="code" title="渠道编码" />
          <Table.Column dataIndex="name" title="渠道名称" />
          <Table.Column dataIndex="signature" title="短信签名" />
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

      <Modal forceRender
        title={formMode === 'create' ? '新增短信渠道' : '编辑短信渠道'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="code" label="渠道编码" rules={[{ required: true, message: '请输入渠道编码 (如 aliyun)' }]}>
            <Input placeholder="请输入渠道编码" />
          </Form.Item>

          <Form.Item name="name" label="渠道名称" rules={[{ required: true, message: '请输入渠道名称' }]}>
            <Input placeholder="请输入渠道名称" />
          </Form.Item>

          <Form.Item name="apiKey" label="API Key (AppKey)" rules={[{ required: true, message: '请输入 API Key' }]}>
            <Input placeholder="请输入 API Key" />
          </Form.Item>

          <Form.Item name="apiSecret" label="API Secret" rules={[{ required: true, message: '请输入 API Secret' }]}>
            <Input placeholder="请输入 API Secret" />
          </Form.Item>

          <Form.Item name="signature" label="短信签名" rules={[{ required: true, message: '请输入短信签名' }]}>
            <Input placeholder="请输入短信签名" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select placeholder="请选择状态" {...statusSelectProps} />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
