'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, Select, Tag, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpMaterialList() {
  const { tableProps, tableQuery } = useTable({ resource: 'mp/material', syncWithLocation: true });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (r: any) => { setEditingId(r.id); form.setFieldsValue(r); setIsModalOpen(true); };
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) { await axiosInstance.put(`/mp/material/${editingId}`, values); message.success('修改成功'); }
      else { await axiosInstance.post('/mp/material', values); message.success('创建成功'); }
      setIsModalOpen(false); tableQuery.refetch();
    } catch (err: any) { message.error(err.response?.data?.message || '操作失败'); } finally { setLoading(false); }
  };
  const handleDelete = async (id: number) => {
    try { await axiosInstance.delete(`/mp/material/${id}`); message.success('删除成功'); tableQuery.refetch(); }
    catch (err: any) { message.error(err.response?.data?.message || '删除失败'); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List headerProps={{ extra: <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增素材</Button> }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="name" title="名称" />
          <Table.Column dataIndex="type" title="类型" width={80} render={(t: string) => <Tag>{t}</Tag>} />
          <Table.Column dataIndex="permanent" title="永久" width={70} render={(v: boolean) => <Tag color={v ? 'green' : 'orange'}>{v ? '是' : '否'}</Tag>} />
          <Table.Column dataIndex="url" title="文件URL" ellipsis />
          <Table.Column title="操作" width={150} render={(_, r: any) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
            </Space>
          )} />
        </Table>
      </List>
      <Modal title={editingId ? '编辑素材' : '新增素材'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="accountId" label="公众号账号ID" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="name" label="名称"><Input /></Form.Item>
          <Form.Item name="type" label="类型" initialValue="image"><Select><Select.Option value="image">图片</Select.Option><Select.Option value="voice">语音</Select.Option><Select.Option value="video">视频</Select.Option><Select.Option value="news">图文</Select.Option></Select></Form.Item>
          <Form.Item name="url" label="文件URL" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="title" label="标题"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
