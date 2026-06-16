'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpMenuList() {
  const { tableProps, tableQuery } = useTable({ resource: 'mp/menu', syncWithLocation: true });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (r: any) => { setEditingId(r.id); form.setFieldsValue(r); setIsModalOpen(true); };
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) { await axiosInstance.put(`/mp/menu/${editingId}`, values); message.success('修改成功'); }
      else { await axiosInstance.post('/mp/menu', values); message.success('创建成功'); }
      setIsModalOpen(false); tableQuery.refetch();
    } catch (err: any) { message.error(err.response?.data?.message || '操作失败'); } finally { setLoading(false); }
  };
  const handleDelete = async (id: number) => {
    try { await axiosInstance.delete(`/mp/menu/${id}`); message.success('删除成功'); tableQuery.refetch(); }
    catch (err: any) { message.error(err.response?.data?.message || '删除失败'); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List headerProps={{ extra: <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增菜单</Button> }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="name" title="菜单名称" />
          <Table.Column dataIndex="type" title="类型" width={100} render={(t: string) => <Tag>{t || '-'}</Tag>} />
          <Table.Column dataIndex="url" title="链接" ellipsis />
          <Table.Column dataIndex="sort" title="排序" width={60} />
          <Table.Column title="操作" width={150} render={(_, r: any) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
            </Space>
          )} />
        </Table>
      </List>
      <Modal title={editingId ? '编辑菜单' : '新增菜单'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={loading} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="accountId" label="公众号账号ID" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="name" label="菜单名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="按钮类型"><Select allowClear placeholder="留空表示父菜单"><Select.Option value="VIEW">VIEW(链接)</Select.Option><Select.Option value="CLICK">CLICK(点击)</Select.Option><Select.Option value="MINIPROGRAM">小程序</Select.Option></Select></Form.Item>
          <Form.Item name="url" label="链接URL"><Input placeholder="类型为VIEW时使用" /></Form.Item>
          <Form.Item name="replyMessageType" label="回复消息类型"><Select allowClear><Select.Option value="text">文本</Select.Option><Select.Option value="image">图片</Select.Option><Select.Option value="news">图文</Select.Option></Select></Form.Item>
          <Form.Item name="replyContent" label="回复内容"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
