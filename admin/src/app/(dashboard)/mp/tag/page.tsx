'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, InputNumber, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpTagList() {
  const { tableProps, tableQuery } = useTable({ resource: 'mp/tag', syncWithLocation: true });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (r: any) => { setEditingId(r.id); form.setFieldsValue(r); setIsModalOpen(true); };
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) { await axiosInstance.put(`/mp/tag/${editingId}`, values); message.success('修改成功'); }
      else { await axiosInstance.post('/mp/tag', values); message.success('创建成功'); }
      setIsModalOpen(false); tableQuery.refetch();
    } catch (err: any) { message.error(err.response?.data?.message || '操作失败'); } finally { setLoading(false); }
  };
  const handleDelete = async (id: number) => {
    try { await axiosInstance.delete(`/mp/tag/${id}`); message.success('删除成功'); tableQuery.refetch(); }
    catch (err: any) { message.error(err.response?.data?.message || '删除失败'); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List headerProps={{ extra: <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增标签</Button> }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="tagId" title="微信标签ID" width={100} />
          <Table.Column dataIndex="name" title="标签名" />
          <Table.Column dataIndex="count" title="粉丝数" width={80} />
          <Table.Column title="操作" width={150} render={(_, r: any) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
            </Space>
          )} />
        </Table>
      </List>
      <Modal title={editingId ? '编辑标签' : '新增标签'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="accountId" label="公众号账号ID" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="tagId" label="微信标签ID" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="name" label="标签名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="count" label="粉丝数" initialValue={0}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
