'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { Card, Space, Button, Table, Select, Modal, Form, Input, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, CloudUploadOutlined, EyeOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpDraftList() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  
  const [drafts, setDrafts] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

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

  // 2. 拉取微信端草稿分页
  const fetchDrafts = async () => {
    if (!selectedAccountId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/mp/draft/page?accountId=${selectedAccountId}&page=${page}&size=${size}`);
      const result = res.data?.data || res.data;
      setDrafts(result.list || []);
      setTotal(result.total || 0);
    } catch {
      message.error('加载草稿箱失败，请核对该账号微信 API 权限。');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDrafts();
  }, [selectedAccountId, page, size]);

  // 3. 新增图文草稿提交
  const handleCreateSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const article = {
        title: values.title,
        author: values.author || '管理员',
        digest: values.digest || '',
        content: values.content, // HTML 正文
        thumb_media_id: values.thumbMediaId, // 微信封面的media_id
        show_cover_pic: 1,
        content_source_url: values.contentSourceUrl || '',
      };
      
      await axiosInstance.post(`/mp/draft/create?accountId=${selectedAccountId}`, {
        articles: [article], // 支持单图文，对齐 yudao-cloud
      });
      message.success('创建图文草稿成功');
      setCreateModalOpen(false);
      fetchDrafts();
    } catch (e: any) {
      message.error(e.response?.data?.message || '创建草稿失败，封面图微信 MediaId 必须合法');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. 一键发表
  const handlePublish = async (mediaId: string) => {
    try {
      await axiosInstance.post(`/mp/draft/publish?accountId=${selectedAccountId}`, { mediaId });
      message.success('一键群发任务已提交，微信正在推送中！');
      setTimeout(() => fetchDrafts(), 1000);
    } catch (e: any) {
      message.error(e.response?.data?.message || '发表失败');
    }
  };

  // 5. 删除草稿
  const handleDelete = async (mediaId: string) => {
    try {
      await axiosInstance.delete(`/mp/draft/delete?accountId=${selectedAccountId}&mediaId=${mediaId}`);
      message.success('草稿已删除');
      fetchDrafts();
    } catch (e: any) {
      message.error(e.response?.data?.message || '删除失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <span>公众号账号：</span>
          <Select
            style={{ width: 220 }}
            placeholder="选择公众号"
            value={selectedAccountId}
            onChange={(v) => { setSelectedAccountId(v); setPage(1); }}
            options={accounts.map((a) => ({ label: a.name, value: a.id }))}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
          新建图文草稿
        </Button>
      </div>

      <Card title="草稿箱列表" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <Table
          dataSource={drafts}
          loading={loading}
          rowKey="media_id"
          pagination={{
            current: page,
            pageSize: size,
            total,
            onChange: (p, s) => { setPage(p); setSize(s); },
            showSizeChanger: true,
          }}
        >
          <Table.Column
            title="图文封面 & 标题"
            render={(_, r: any) => {
              const article = r.content?.news_item?.[0] || {};
              return (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {article.thumb_url && <img src={article.thumb_url} alt="封面" style={{ width: 60, height: 40, borderRadius: 4, objectFit: 'cover' }} />}
                  <div>
                    <Typography.Text strong>{article.title || '无标题'}</Typography.Text>
                    <div style={{ fontSize: 12, color: '#999' }}>作者: {article.author || '-'}</div>
                  </div>
                </div>
              );
            }}
          />
          <Table.Column
            title="摘要"
            render={(_, r: any) => {
              const article = r.content?.news_item?.[0] || {};
              return <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>{article.digest || '-'}</Typography.Paragraph>;
            }}
          />
          <Table.Column
            title="更新时间"
            dataIndex="update_time"
            width={180}
            render={(t: number) => new Date(t * 1000).toLocaleString()}
          />
          <Table.Column
            title="操作"
            width={280}
            render={(_, r: any) => {
              const article = r.content?.news_item?.[0] || {};
              return (
                <Space>
                  {article.url && (
                    <Button size="small" type="link" icon={<EyeOutlined />} href={article.url} target="_blank">
                      微信预览
                    </Button>
                  )}
                  <Popconfirm title="确认群发这篇图文给公众号所有粉丝？" onConfirm={() => handlePublish(r.media_id)}>
                    <Button size="small" type="primary" ghost icon={<CloudUploadOutlined />}>
                      群发发表
                    </Button>
                  </Popconfirm>
                  <Popconfirm title="确认彻底删除该草稿？" onConfirm={() => handleDelete(r.media_id)}>
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              );
            }}
          />
        </Table>
      </Card>

      {/* 创建图文草稿模态框 */}
      <Modal
        title="新建图文草稿"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={750}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item name="title" label="图文标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input maxLength={64} placeholder="请输入图文标题" />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="author" label="作者" style={{ flex: 1 }}>
              <Input placeholder="作者名（选填）" />
            </Form.Item>
            <Form.Item name="thumbMediaId" label="封面图片微信 MediaId" style={{ flex: 1 }} rules={[{ required: true, message: '封面图不能为空，请在“素材管理”中上传并获取它的 mediaId 填入' }]}>
              <Input placeholder="请填入已上传图片素材的 MediaId" />
            </Form.Item>
          </div>
          <Form.Item name="digest" label="图文摘要">
            <Input.TextArea rows={2} maxLength={120} placeholder="单图文若为空微信会自动抓取前54个字" />
          </Form.Item>
          <Form.Item name="content" label="富文本正文 (HTML 格式)" rules={[{ required: true, message: '正文内容不能为空' }]}>
            <Input.TextArea rows={6} placeholder="例: <p>你好，这是微信公众号的正文内容...</p>" />
          </Form.Item>
          <Form.Item name="contentSourceUrl" label="原文阅读链接 URL">
            <Input placeholder="点击“阅读原文”跳转的链接（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
