'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Drawer, Tabs, Switch, Button, message } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { SlidersOutlined, WalletOutlined, AlipayOutlined, WechatOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

export default function PayAppList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'pay/app',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  // Channel Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Channel Form states
  const [mockForm] = Form.useForm();
  const [alipayForm] = Form.useForm();
  const [wechatForm] = Form.useForm();

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
    resource: 'pay/app',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const openChannelDrawer = async (app: any) => {
    setSelectedApp(app);
    setIsDrawerOpen(true);
    setDrawerLoading(true);
    mockForm.resetFields();
    alipayForm.resetFields();
    wechatForm.resetFields();

    try {
      const res = await axiosInstance.get(`/pay/channel/app/${app.id}`);
      const channelList = res.data || [];
      setChannels(channelList);

      // Populate forms
      const mockChan = channelList.find((c: any) => c.code === 'mock');
      if (mockChan) {
        mockForm.setFieldsValue({
          status: mockChan.status === 'ENABLE',
          remark: mockChan.remark,
        });
      } else {
        mockForm.setFieldsValue({ status: true });
      }

      const alipayChan = channelList.find((c: any) => c.code === 'alipay');
      if (alipayChan) {
        alipayForm.setFieldsValue({
          status: alipayChan.status === 'ENABLE',
          remark: alipayChan.remark,
          appId: alipayChan.config?.appId || '',
          privateKey: alipayChan.config?.privateKey || '',
          publicKey: alipayChan.config?.publicKey || '',
        });
      } else {
        alipayForm.setFieldsValue({ status: false });
      }

      const wechatChan = channelList.find((c: any) => c.code === 'wechat');
      if (wechatChan) {
        wechatForm.setFieldsValue({
          status: wechatChan.status === 'ENABLE',
          remark: wechatChan.remark,
          appId: wechatChan.config?.appId || '',
          mchId: wechatChan.config?.mchId || '',
          apiKey: wechatChan.config?.apiKey || '',
        });
      } else {
        wechatForm.setFieldsValue({ status: false });
      }
    } catch (err: any) {
      message.error('加载渠道配置失败: ' + (err.response?.data?.message || err.message));
    } finally {
      setDrawerLoading(false);
    }
  };

  const saveChannel = async (channelCode: string, values: any) => {
    if (!selectedApp) return;

    let config: any = {};
    if (channelCode === 'mock') {
      config = { enabled: true };
    } else if (channelCode === 'alipay') {
      config = {
        appId: values.appId,
        privateKey: values.privateKey,
        publicKey: values.publicKey,
      };
    } else if (channelCode === 'wechat') {
      config = {
        appId: values.appId,
        mchId: values.mchId,
        apiKey: values.apiKey,
      };
    }

    try {
      await axiosInstance.post('/pay/channel', {
        appId: selectedApp.id,
        code: channelCode,
        status: values.status ? 'ENABLE' : 'DISABLE',
        remark: values.remark || '',
        config,
      });
      message.success(`保存渠道 [${channelCode}] 配置成功`);
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error('保存失败: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        title="支付应用管理"
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="name" 
            title="应用名称" 
            render={(name: string) => (
              <Space>
                <SlidersOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column dataIndex="code" title="应用编码" />
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
            width={240}
            render={(_, record: any) => (
              <Space>
                <Button 
                  size="small" 
                  type="primary" 
                  ghost 
                  icon={<WalletOutlined />} 
                  onClick={() => openChannelDrawer(record)}
                >
                  配置渠道
                </Button>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      {/* App Form Modal */}
      <Modal
        title={formMode === 'create' ? '新增支付应用' : '编辑支付应用'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onFinish(values)}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="name"
            label="应用名称"
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="例：商城应用" />
          </Form.Item>

          <Form.Item
            name="code"
            label="应用编码"
            rules={[{ required: true, message: '请输入应用编码' }]}
          >
            <Input placeholder="例：mall_app" disabled={formMode === 'edit'} />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Channels Configuration Drawer */}
      <Drawer
        title={`配置支付渠道 - ${selectedApp?.name || ''}`}
        width={640}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        loading={drawerLoading}
      >
        <Tabs defaultActiveKey="mock" type="card">
          <Tabs.TabPane 
            tab={
              <span>
                <WalletOutlined />
                模拟支付
              </span>
            } 
            key="mock"
          >
            <Form
              form={mockForm}
              layout="vertical"
              onFinish={(values) => saveChannel('mock', values)}
            >
              <Form.Item name="status" label="启用状态" valuePropName="checked">
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={2} placeholder="可记录测试相关说明" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存配置
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <AlipayOutlined style={{ color: '#1677ff' }} />
                支付宝
              </span>
            } 
            key="alipay"
          >
            <Form
              form={alipayForm}
              layout="vertical"
              onFinish={(values) => saveChannel('alipay', values)}
            >
              <Form.Item name="status" label="启用状态" valuePropName="checked">
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item
                name="appId"
                label="支付宝 AppID"
                rules={[{ required: true, message: '请输入支付宝 AppID' }]}
              >
                <Input placeholder="请输入 AppID" />
              </Form.Item>

              <Form.Item
                name="privateKey"
                label="商户应用私钥 (Merchant Private Key)"
                rules={[{ required: true, message: '请输入应用私钥' }]}
              >
                <Input.TextArea rows={4} placeholder="请输入商户私钥 PKCS8 格式" />
              </Form.Item>

              <Form.Item
                name="publicKey"
                label="支付宝公钥 (Alipay Public Key)"
                rules={[{ required: true, message: '请输入公钥' }]}
              >
                <Input.TextArea rows={4} placeholder="请输入支付宝公钥" />
              </Form.Item>

              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={2} placeholder="备注说明" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存配置
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <WechatOutlined style={{ color: '#52c41a' }} />
                微信支付
              </span>
            } 
            key="wechat"
          >
            <Form
              form={wechatForm}
              layout="vertical"
              onFinish={(values) => saveChannel('wechat', values)}
            >
              <Form.Item name="status" label="启用状态" valuePropName="checked">
                <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
              </Form.Item>

              <Form.Item
                name="appId"
                label="微信公众号/小程序 AppID"
                rules={[{ required: true, message: '请输入微信 AppID' }]}
              >
                <Input placeholder="请输入 AppID" />
              </Form.Item>

              <Form.Item
                name="mchId"
                label="微信支付商户号 MchID"
                rules={[{ required: true, message: '请输入商户号' }]}
              >
                <Input placeholder="请输入微信支付商户号" />
              </Form.Item>

              <Form.Item
                name="apiKey"
                label="商户 API Key (V2/V3 Key)"
                rules={[{ required: true, message: '请输入 API 密钥' }]}
              >
                <Input placeholder="请输入商户 API 密钥" />
              </Form.Item>

              <Form.Item name="remark" label="备注">
                <Input.TextArea rows={2} placeholder="备注说明" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存配置
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
}
