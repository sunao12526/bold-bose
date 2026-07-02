'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { Card, Space, Button, Table, Select, Modal, Form, Input, message, Tag, Typography } from 'antd';
import { SyncOutlined, SendOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpMessageTemplateList() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);

  // 发送弹窗状态
  const [sendModalOpen, setSendModalOpen] = React.useState(false);
  const [currentTemplate, setCurrentTemplate] = React.useState<any>(null);
  const [dynamicKeys, setDynamicKeys] = React.useState<string[]>([]);
  const [form] = Form.useForm();
  const [sending, setSending] = React.useState(false);

  // 1. 获取所有公众号账号
  React.useEffect(() => {
    axiosInstance.get('/mp/account').then((res: any) => {
      const data = res.data?.data || res.data || [];
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    });
  }, []);

  // 2. 加载本地消息模板列表
  const fetchTemplates = async () => {
    if (!selectedAccountId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/mp/message-template?accountId=${selectedAccountId}`);
      setTemplates(res.data?.data || res.data || []);
    } catch {
      message.error('获取模板列表失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTemplates();
  }, [selectedAccountId]);

  // 3. 一键同步
  const handleSync = async () => {
    if (!selectedAccountId) return;
    setSyncing(true);
    try {
      await axiosInstance.post(`/mp/message-template/sync?accountId=${selectedAccountId}`);
      message.success('模板消息同步完成');
      fetchTemplates();
    } catch (e: any) {
      message.error(e.response?.data?.message || '同步失败');
    } finally {
      setSyncing(false);
    }
  };

  // 4. 解析模板内容中的占位符键名 (例如 {{code.DATA}} 中的 code)
  const parseDataKeys = (content: string) => {
    const regex = /\{\{(.*?)\.DATA\}\}/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return Array.from(new Set(matches)); // 去重
  };

  // 5. 弹出测试发送框
  const openSendModal = (tpl: any) => {
    setCurrentTemplate(tpl);
    const keys = parseDataKeys(tpl.content);
    setDynamicKeys(keys);
    form.resetFields();
    setSendModalOpen(true);
  };

  // 6. 测试提交发送
  const handleSendSubmit = async (values: any) => {
    setSending(true);
    try {
      // 构建微信规范的 key-value 数据结构
      const wechatData: Record<string, { value: string }> = {};
      dynamicKeys.forEach(k => {
        wechatData[k] = { value: values[`key_${k}`] || '' };
      });

      const res = await axiosInstance.post('/mp/message-template/send', {
        id: currentTemplate.id,
        openid: values.openid,
        url: values.url || undefined,
        data: wechatData,
      });

      message.success(`模板消息发送成功！微信返回消息ID: ${res.data?.data || res.data}`);
      setSendModalOpen(false);
    } catch (e: any) {
      message.error(e.response?.data?.message || '发送失败，请确保接收人 OpenID 属于当前公众号的粉丝');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <span>当前公众号：</span>
          <Select
            style={{ width: 220 }}
            placeholder="选择公众号"
            value={selectedAccountId}
            onChange={(v) => setSelectedAccountId(v)}
            options={accounts.map((a) => ({ label: a.name, value: a.id }))}
          />
        </Space>
        <Button icon={<SyncOutlined spin={syncing} />} onClick={handleSync} loading={syncing}>
          同步消息模板
        </Button>
      </div>

      <Card title="模板消息列表" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <Table dataSource={templates} loading={loading} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="templateId" title="微信模板 ID" ellipsis />
          <Table.Column dataIndex="title" title="模板标题" width={150} />
          <Table.Column
            title="行业归属"
            width={160}
            render={(_, r: any) => (
              <div>
                <Tag color="cyan">{r.primaryIndustry || '通用'}</Tag>
                {r.deputyIndustry && <Tag color="blue">{r.deputyIndustry}</Tag>}
              </div>
            )}
          />
          <Table.Column
            dataIndex="content"
            title="模板正文预览"
            render={(txt: string) => <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>{txt}</Typography.Paragraph>}
          />
          <Table.Column
            title="操作"
            width={120}
            render={(_, r: any) => (
              <Button size="small" type="primary" ghost icon={<SendOutlined />} onClick={() => openSendModal(r)}>
                测试发送
              </Button>
            )}
          />
        </Table>
      </Card>

      {/* 测试发送模态框 */}
      <Modal
        title={currentTemplate ? `测试推送模版: ${currentTemplate.title}` : '推送模板消息'}
        open={sendModalOpen}
        onCancel={() => setSendModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={sending}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSendSubmit}>
          <Form.Item name="openid" label="接收粉丝 OpenID" rules={[{ required: true, message: '接收人 OpenID 不能为空' }]}>
            <Input placeholder="请输入接收人粉丝的公众号 OpenID" />
          </Form.Item>
          <Form.Item name="url" label="跳转网页链接 URL">
            <Input placeholder="点击卡片后在微信中跳转的链接 (https://... 选填)" />
          </Form.Item>

          {dynamicKeys.length > 0 && (
            <Card size="small" title="模版变量参数配置" style={{ marginTop: 12, backgroundColor: '#fafafa' }}>
              {dynamicKeys.map((k) => (
                <Form.Item
                  key={k}
                  name={`key_${k}`}
                  label={`变量: {{${k}.DATA}}`}
                  rules={[{ required: true, message: `请输入 ${k} 的参数值` }]}
                >
                  <Input placeholder={`请输入 {{${k}.DATA}} 占位符的内容`} />
                </Form.Item>
              ))}
            </Card>
          )}
        </Form>
      </Modal>
    </div>
  );
}
