'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpAutoReplyList() {
  const { tableProps, tableQuery } = useTable({ resource: 'mp/auto-reply', syncWithLocation: true });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (r: any) => { setEditingId(r.id); form.setFieldsValue(r); setIsModalOpen(true); };
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) { await axiosInstance.put(`/mp/auto-reply/${editingId}`, values); message.success('修改成功'); }
      else { await axiosInstance.post('/mp/auto-reply', values); message.success('创建成功'); }
      setIsModalOpen(false); tableQuery.refetch();
    } catch (err: any) { message.error(err.response?.data?.message || '操作失败'); } finally { setLoading(false); }
  };
  const handleDelete = async (id: number) => {
    try { await axiosInstance.delete(`/mp/auto-reply/${id}`); message.success('删除成功'); tableQuery.refetch(); }
    catch (err: any) { message.error(err.response?.data?.message || '删除失败'); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List headerProps={{ extra: <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增自动回复</Button> }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="type" title="类型" width={100} render={(t: number) => <Tag color={t === 1 ? 'blue' : 'green'}>{t === 1 ? '关键词回复' : '关注时回复'}</Tag>} />
          <Table.Column dataIndex="requestKeyword" title="关键词" ellipsis />
          <Table.Column dataIndex="responseMessageType" title="回复类型" width={80} />
          <Table.Column dataIndex="responseContent" title="回复内容" ellipsis />
          <Table.Column dataIndex="status" title="状态" width={80} render={(s: string) => <Tag color={s === 'ENABLE' ? 'green' : 'red'}>{s === 'ENABLE' ? '启用' : '禁用'}</Tag>} />
          <Table.Column title="操作" width={150} render={(_, r: any) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
            </Space>
          )} />
        </Table>
      </List>
      <Modal title={editingId ? '编辑自动回复' : '新增自动回复'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={loading} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="accountId" label="公众号账号ID" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="type" label="回复类型" rules={[{ required: true }]} initialValue={1}><Select><Select.Option value={1}>关键词回复</Select.Option><Select.Option value={2}>关注时回复</Select.Option></Select></Form.Item>
          <Form.Item name="requestKeyword" label="关键词"><Input placeholder="关键词回复时必填" /></Form.Item>
          <Form.Item name="requestMatch" label="匹配方式" initialValue={1}><Select><Select.Option value={1}>全匹配</Select.Option><Select.Option value={2}>半匹配</Select.Option></Select></Form.Item>
          <Form.Item name="responseMessageType" label="回复消息类型" rules={[{ required: true }]} initialValue="text"><Select><Select.Option value="text">文本</Select.Option><Select.Option value="image">图片</Select.Option><Select.Option value="news">图文</Select.Option></Select></Form.Item>
          <Form.Item name="responseContent" label="回复内容"><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="ENABLE"><Select><Select.Option value="ENABLE">启用</Select.Option><Select.Option value="DISABLE">禁用</Select.Option></Select></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
