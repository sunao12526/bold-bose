'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Button, message } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';
import { SendOutlined } from '@ant-design/icons';

export default function MailTemplateList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/mail/template',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  // Test states
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testTemplateId, setTestTemplateId] = useState<number | null>(null);
  const [testForm] = Form.useForm();

  const { selectProps: statusSelectProps } = useSelect({
    resource: 'system/dict-data',
    optionLabel: 'label',
    optionValue: 'value',
    filters: [{ field: 'dictType', operator: 'eq', value: 'sys_common_status' }],
  });

  // Load Mail accounts for dropdown selector
  const { selectProps: accountSelectProps } = useSelect({
    resource: 'system/mail/account',
    optionLabel: 'mail',
    optionValue: 'id',
  });

  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.resetFields();
    form.setFieldsValue({
      ...record,
      accountId: record.account?.id,
    });
    setIsModalOpen(true);
  };

  const { onFinish, formLoading } = useForm({
    resource: 'system/mail/template',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  const handleTestOpen = (id: number) => {
    setTestTemplateId(id);
    testForm.resetFields();
    setIsTestModalOpen(true);
  };

  const handleTestSend = async (values: any) => {
    if (!testTemplateId) return;
    try {
      const paramsParsed = values.params ? JSON.parse(values.params) : {};
      const res = await fetch(`http://localhost:3000/admin-api/system/mail/template/${testTemplateId}/send-mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          receiver: values.receiver,
          params: paramsParsed,
        }),
      });
      if (!res.ok) {
        throw new Error('发送失败');
      }
      message.success('已触发模拟邮件发送，请查看日志！');
      setIsTestModalOpen(false);
    } catch (err: any) {
      message.error(err.message || '发送失败，请检查参数格式！');
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
          <Table.Column dataIndex="id" title="模板编号" width={100} />
          <Table.Column 
            dataIndex="account" 
            title="发送邮箱" 
            render={(val: any) => val ? val.mail : '-'} 
          />
          <Table.Column dataIndex="code" title="模板编码" />
          <Table.Column dataIndex="name" title="模板名称" />
          <Table.Column dataIndex="title" title="邮件标题" ellipsis />
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
            width={180}
            render={(_, record: any) => (
              <Space>
                <Button 
                  icon={<SendOutlined />} 
                  size="small" 
                  onClick={() => handleTestOpen(record.id)}
                  disabled={record.status === 'DISABLE'}
                >
                  测试
                </Button>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增邮件模板' : '编辑邮件模板'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = { ...values };
            payload.accountId = Number(payload.accountId);
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="accountId" label="邮箱账号" rules={[{ required: true, message: '请选择邮箱账号' }]}>
            <Select placeholder="请选择邮箱账号" {...accountSelectProps} />
          </Form.Item>

          <Form.Item name="code" label="模板编码" rules={[{ required: true, message: '请输入模板编码' }]}>
            <Input placeholder="请输入模板编码" />
          </Form.Item>

          <Form.Item name="name" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item name="title" label="邮件标题" rules={[{ required: true, message: '请输入邮件标题' }]}>
            <Input placeholder="请输入邮件标题，支持占位符如 {code}" />
          </Form.Item>

          <Form.Item name="content" label="邮件内容" rules={[{ required: true, message: '请输入邮件内容' }]}>
            <Input.TextArea rows={8} placeholder="请输入邮件内容，支持 HTML 文本，如：&#10;<h3>您好：</h3><p>您的登录验证码是 {code}。</p>" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select placeholder="请选择状态" {...statusSelectProps} />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="邮件发送测试"
        open={isTestModalOpen}
        onCancel={() => setIsTestModalOpen(false)}
        onOk={() => testForm.submit()}
      >
        <Form
          form={testForm}
          layout="vertical"
          onFinish={handleTestSend}
        >
          <Form.Item name="receiver" label="接收邮箱地址" rules={[{ required: true, message: '请输入测试接收邮箱地址', type: 'email' }]}>
            <Input placeholder="请输入接收邮箱地址" />
          </Form.Item>

          <Form.Item name="params" label="模板参数 (JSON 键值对)" initialValue='{"code": "123456"}'>
            <Input.TextArea rows={4} placeholder='请输入模板占位符参数，如：&#10;{"code": "123456"}' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
