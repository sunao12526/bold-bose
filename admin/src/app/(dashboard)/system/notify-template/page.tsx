'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Switch, Button, message, Alert } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function NotifyTemplateList() {
  // 1. Core Refine Table hook
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/notify-template',
    syncWithLocation: true,
  });

  // 2. Add/Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // 3. Test Modal States
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testTemplate, setTestTemplate] = useState<any>(null);
  const [testForm] = Form.useForm();
  const [customVars, setCustomVars] = useState<string[]>([]);
  const [sendingTest, setSendingTest] = useState(false);

  // 4. Load users for testing dropdown
  const { selectProps: userSelectProps } = useSelect({
    resource: 'system/user',
    optionLabel: 'nickname',
    optionValue: 'id',
  });

  // 5. Refine Form hook for Create/Edit
  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'system/notify-template',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  // 6. Handlers
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

  const handleOpenTest = (record: any) => {
    setTestTemplate(record);
    testForm.resetFields();
    
    // Extract placeholders, e.g. {nickname}, {time}
    const combinedText = (record.title || '') + ' ' + (record.content || '');
    const regex = /\{([^{}]+)\}/g;
    const vars: string[] = [];
    let match;
    while ((match = regex.exec(combinedText)) !== null) {
      const v = match[1].trim();
      // Skip standard variables automatically loaded by server
      if (!['nickname', 'username', 'email', 'mobile'].includes(v) && !vars.includes(v)) {
        vars.push(v);
      }
    }
    setCustomVars(vars);
    setIsTestModalOpen(true);
  };

  const handleSendTest = async (values: any) => {
    setSendingTest(true);
    try {
      const payload = {
        userId: values.userId,
        templateCode: testTemplate.code,
        variables: values.variables || {},
      };
      await axiosInstance.post('/system/notify-template/send-test', payload);
      message.success('测试通知发送成功，请在对应通道查收！');
      setIsTestModalOpen(false);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || '测试发送失败，请检查配置和参数');
    } finally {
      setSendingTest(false);
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
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column dataIndex="name" title="模板名称" />
          <Table.Column 
            dataIndex="code" 
            title="模板编码" 
            render={(code: string) => <Tag color="purple">{code}</Tag>} 
          />
          <Table.Column 
            dataIndex="type" 
            title="发送类型" 
            render={(type: string) => {
              let color = 'blue';
              let text = type;
              if (type === 'SYSTEM') { color = 'cyan'; text = '站内信'; }
              if (type === 'EMAIL') { color = 'orange'; text = '邮件'; }
              if (type === 'SMS') { color = 'magenta'; text = '短信'; }
              return <Tag color={color}>{text}</Tag>;
            }} 
          />
          <Table.Column dataIndex="title" title="模板标题" ellipsis />
          <Table.Column dataIndex="content" title="模板内容" ellipsis />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            render={(status: string) => (
              <Tag color={status === 'ENABLE' ? 'success' : 'error'}>
                {status === 'ENABLE' ? '启用' : '禁用'}
              </Tag>
            )}
          />
          <Table.Column dataIndex="remark" title="备注" ellipsis />
          <Table.Column
            title="操作"
            dataIndex="actions"
            render={(_, record: any) => (
              <Space>
                <Button 
                  size="small" 
                  type="text" 
                  icon={<SendOutlined style={{ color: '#1890ff' }} />} 
                  onClick={() => handleOpenTest(record)}
                >
                  测试
                </Button>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Create / Edit Modal */}
      <Modal forceRender
        title={formMode === 'create' ? '新增通知模板' : '编辑通知模板'}
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
            // Map switch to CommonStatus
            const payload = {
              ...values,
              status: values.status ? 'ENABLE' : 'DISABLE',
            };
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              name="name"
              label="模板名称"
              rules={[{ required: true, message: '请输入模板名称' }]}
              style={{ width: 320 }}
            >
              <Input placeholder="请输入模板名称，例如：欢迎新用户" />
            </Form.Item>

            <Form.Item
              name="code"
              label="模板编码"
              rules={[{ required: true, message: '请输入模板编码' }]}
              style={{ width: 320 }}
            >
              <Input disabled={formMode === 'edit'} placeholder="唯一编码，例如：user_welcome" />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }} size="large">
            <Form.Item
              name="type"
              label="通知类型"
              rules={[{ required: true, message: '请选择通知类型' }]}
              style={{ width: 320 }}
              initialValue="SYSTEM"
            >
              <Select>
                <Select.Option value="SYSTEM">站内信 (SYSTEM)</Select.Option>
                <Select.Option value="EMAIL">电子邮件 (EMAIL)</Select.Option>
                <Select.Option value="SMS">短信 (SMS)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="status" 
              label="开启状态" 
              valuePropName="checked" 
              initialValue={true}
              getValueProps={(val) => ({ checked: val === 'ENABLE' || val === true })}
              style={{ width: 320 }}
            >
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Space>

          <Form.Item
            name="title"
            label="模板标题"
            rules={[{ required: true, message: '请输入模板标题' }]}
          >
            <Input placeholder="站内信标题或邮件主题，例如：欢迎光临 {systemName}" />
          </Form.Item>

          <Form.Item
            name="content"
            label="模板内容"
            rules={[{ required: true, message: '请输入模板内容' }]}
            help="支持 {name} 等插值占位符。系统自动提供：{nickname}, {username}, {email}, {mobile}。"
          >
            <Input.TextArea rows={4} placeholder="请输入模板内容" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Test Send Modal */}
      <Modal forceRender
        title={`测试发送通知 - ${testTemplate?.name || ''}`}
        open={isTestModalOpen}
        onCancel={() => setIsTestModalOpen(false)}
        onOk={() => testForm.submit()}
        confirmLoading={sendingTest}
      >
        <Alert
          message="参数说明"
          description={
            <div>
              <p>当前发送方式: <strong>{testTemplate?.type === 'SYSTEM' ? '站内信' : testTemplate?.type === 'EMAIL' ? '电子邮件' : '手机短信'}</strong></p>
              <p>系统变量 <code>{'{nickname}'}</code>, <code>{'{username}'}</code> 等会自动绑定目标用户的信息，无需手动填写。</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={testForm} layout="vertical" onFinish={handleSendTest}>
          <Form.Item
            name="userId"
            label="接收用户"
            rules={[{ required: true, message: '请选择接收用户' }]}
          >
            <Select 
              {...userSelectProps} 
              placeholder="请选择接收的测试用户"
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {customVars.length > 0 && (
            <div>
              <h4 style={{ marginBottom: 8, fontSize: 14 }}>模板自定义参数</h4>
              {customVars.map((v) => (
                <Form.Item
                  key={v}
                  name={['variables', v]}
                  label={`参数 {${v}}`}
                  rules={[{ required: true, message: `请输入参数 ${v}` }]}
                >
                  <Input placeholder={`请输入替换 ${v} 的真实值`} />
                </Form.Item>
              ))}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
