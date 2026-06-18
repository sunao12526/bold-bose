'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, message, Drawer, Tabs, Switch, DatePicker } from 'antd';
import { useTable, useSelect } from '@refinedev/antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined
} from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';
import nextDynamic from 'next/dynamic';

// Import BlockNote dynamically (client-side only)
const BlockNoteEditor = nextDynamic(() => import('../../../../components/BlockNoteEditor'), { ssr: false });

export default function CmsArticleList() {
  const { tableProps, tableQuery } = useTable({
    resource: 'cms/article',
    syncWithLocation: true,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<any>(null);

  const { selectProps: categorySelectProps } = useSelect({
    resource: 'cms/category',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const { selectProps: tagSelectProps } = useSelect({
    resource: 'cms/tag',
    optionLabel: 'name',
    optionValue: 'id',
  });

  const statusMap: Record<string, { color: string; text: string }> = {
    DRAFT: { color: 'default', text: '草稿' },
    PUBLISHED: { color: 'green', text: '已发布' },
    ARCHIVED: { color: 'orange', text: '已归档' },
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const handleEdit = async (record: any) => {
    setEditingId(record.id);
    const res = await axiosInstance.get(`/cms/article/${record.id}`);
    const article = res.data;
    form.setFieldsValue({
      ...article,
      tagIds: article.tags?.map((t: any) => t.tag?.id) || [],
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/cms/article/${editingId}`, values);
        message.success('修改成功');
      } else {
        await axiosInstance.post('/cms/article', { ...values, author: 'admin' });
        message.success('创建成功');
      }
      setIsDrawerOpen(false);
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/cms/article/${id}`);
      message.success('删除成功');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '删除失败');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await axiosInstance.put(`/cms/article/${id}/status`, { status });
      message.success('状态修改成功');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '操作失败');
    }
  };

  const handlePreview = async (id: number) => {
    try {
      const res = await axiosInstance.get(`/cms/article/${id}`);
      setPreviewArticle(res.data);
    } catch (err: any) {
      message.error('加载文章失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新增文章
            </Button>
          ),
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="title" title="标题" ellipsis width={200} />
          <Table.Column
            dataIndex={['category', 'name']}
            title="分类"
            width={100}
            render={(name: string) => name ? <Tag>{name}</Tag> : '-'}
          />
          <Table.Column
            dataIndex="tags"
            title="标签"
            width={150}
            render={(tags: any[]) => (
              <Space wrap size={4}>
                {tags?.slice(0, 2).map((t: any) => (
                  <Tag key={t.tag?.id} color="blue">{t.tag?.name}</Tag>
                ))}
                {tags?.length > 2 && <Tag>+{tags.length - 2}</Tag>}
              </Space>
            )}
          />
          <Table.Column dataIndex="author" title="作者" width={80} />
          <Table.Column dataIndex="viewCount" title="浏览" width={60} />
          <Table.Column
            dataIndex="status"
            title="状态"
            width={90}
            render={(status: string) => {
              const s = statusMap[status] || { color: 'default', text: status };
              return <Tag color={s.color}>{s.text}</Tag>;
            }}
          />
          <Table.Column
            dataIndex="isTop"
            title="置顶"
            width={60}
            render={(val: boolean) => val ? <Tag color="red">置顶</Tag> : '-'}
          />
          <Table.Column
            dataIndex="createdAt"
            title="创建时间"
            width={160}
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            title="操作"
            width={280}
            render={(_, record: any) => (
              <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record.id)}>
                  预览
                </Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  编辑
                </Button>
                {record.status === 'DRAFT' && (
                  <Button size="small" type="primary" onClick={() => handleStatusChange(record.id, 'PUBLISHED')}>
                    发布
                  </Button>
                )}
                {record.status === 'PUBLISHED' && (
                  <Button size="small" onClick={() => handleStatusChange(record.id, 'ARCHIVED')}>
                    归档
                  </Button>
                )}
                <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </List>

      <Drawer
        title={editingId ? '编辑文章' : '新增文章'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={800}
        extra={
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            保存
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item name="categoryId" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select {...categorySelectProps} placeholder="请选择分类" />
          </Form.Item>
          <Form.Item name="tagIds" label="标签">
            <Select {...tagSelectProps} mode="multiple" placeholder="请选择标签" />
          </Form.Item>
          <Form.Item name="summary" label="摘要">
            <Input.TextArea rows={2} placeholder="请输入文章摘要" />
          </Form.Item>
          <Form.Item name="coverUrl" label="封面图URL">
            <Input placeholder="请输入封面图URL" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <BlockNoteEditor key={editingId || 'new'} />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isTop" label="置顶" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item name="isRecommend" label="推荐" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="DRAFT">
            <Select>
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">发布</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={null}
        open={!!previewArticle}
        onCancel={() => setPreviewArticle(null)}
        footer={null}
        width={850}
      >
        {previewArticle && (
          <div style={{ padding: '8px 16px' }}>
            <div style={{ marginBottom: 16, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Tag color={statusMap[previewArticle.status]?.color}>{statusMap[previewArticle.status]?.text}</Tag>
              {previewArticle.category?.name && (
                <Tag color="purple">{previewArticle.category.name}</Tag>
              )}
              {previewArticle.isTop && <Tag color="red">置顶</Tag>}
              {previewArticle.isRecommend && <Tag color="orange">推荐</Tag>}
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1f1f1f', marginBottom: 16, lineHeight: 1.3 }}>
              {previewArticle.title}
            </h1>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              paddingBottom: '20px', 
              borderBottom: '1px solid #f0f0f0', 
              marginBottom: 24,
              color: '#8c8c8c', 
              fontSize: '13px' 
            }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#1890ff', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 14
              }}>
                {previewArticle.author?.substring(0, 1).toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontWeight: 500, color: '#434343' }}>{previewArticle.author || '管理员'}</div>
                <div>
                  发布于: {new Date(previewArticle.createdAt).toLocaleString()} &bull; 浏览: {previewArticle.viewCount || 0}
                </div>
              </div>
            </div>

            {previewArticle.summary && (
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#fafafa', 
                borderLeft: '4px solid #d9d9d9', 
                borderRadius: '0 4px 4px 0',
                color: '#595959', 
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: 24
              }}>
                <strong>摘要：</strong>{previewArticle.summary}
              </div>
            )}

            <div className="article-preview-content">
              <div dangerouslySetInnerHTML={{ __html: previewArticle.content }} />
            </div>

            {previewArticle.tags?.length > 0 && (
              <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 32, paddingTop: 16, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: '#8c8c8c', fontSize: '13px', marginRight: 4 }}>标签:</span>
                {previewArticle.tags.map((t: any) => (
                  <Tag key={t.tag?.id} color="blue">{t.tag?.name}</Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
