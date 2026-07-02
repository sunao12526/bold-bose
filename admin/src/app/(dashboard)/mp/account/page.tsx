'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, Select, Tag, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpAccountList() {
  const { tableProps, tableQuery } = useTable({ resource: 'mp/account', syncWithLocation: true });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = () => { setEditingId(null); form.resetFields(); setIsModalOpen(true); };
  const handleEdit = (record: any) => { setEditingId(record.id); form.setFieldsValue(record); setIsModalOpen(true); };
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) { await axiosInstance.put(`/mp/account/${editingId}`, values); message.success('修改成功'); }
      else { await axiosInstance.post('/mp/account', values); message.success('创建成功'); }
      setIsModalOpen(false); tableQuery.refetch();
    } catch (err: any) { message.error(err.response?.data?.message || '操作失败'); }
    finally { setLoading(false); }
  };
  const handleDelete = async (id: number) => {
    try { await axiosInstance.delete(`/mp/account/${id}`); message.success('删除成功'); tableQuery.refetch(); }
    catch (err: any) { message.error(err.response?.data?.message || '删除失败'); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List headerProps={{ extra: <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增账号</Button> }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column dataIndex="name" title="公众号名称" />
          <Table.Column dataIndex="account" title="公众号账号" />
          <Table.Column dataIndex="appId" title="AppID" ellipsis />
          <Table.Column dataIndex="qrCodeUrl" title="二维码" width={100} render={(url: string) => url ? <img src={url} alt="二维码" style={{ width: 40, height: 40, cursor: 'pointer' }} onClick={() => Modal.info({ title: '公众号二维码', content: <img src={url} alt="二维码" style={{ width: '100%' }} />, width: 340 })} /> : '-'} />
          <Table.Column dataIndex="status" title="状态" width={80} render={(s: string) => <Tag color={s === 'ENABLE' ? 'green' : 'red'}>{s === 'ENABLE' ? '启用' : '禁用'}</Tag>} />
          <Table.Column title="操作" width={320} render={(_, r: any) => (
            <Space>
              <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
              <Button size="small" type="dashed" onClick={async () => {
                try {
                  const res = await axiosInstance.put(`/mp/account/generate-qr-code?id=${r.id}`);
                  message.success('生成二维码成功');
                  tableQuery.refetch();
                } catch (e: any) {
                  message.error(e.response?.data?.message || '生成失败');
                }
              }}>生成二维码</Button>
              <Button size="small" danger type="dashed" onClick={async () => {
                try {
                  await axiosInstance.put(`/mp/account/clear-quota?id=${r.id}`);
                  message.success('已清空 API 额度');
                } catch (e: any) {
                  message.error(e.response?.data?.message || '操作失败');
                }
              }}>重置配额</Button>
              <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
            </Space>
          )} />
        </Table>
      </List>
      <Modal title={editingId ? '编辑公众号' : '新增公众号'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={loading}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="公众号名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="account" label="公众号账号" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="appId" label="AppID" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="appSecret" label="AppSecret" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Form.Item name="token" label="Token" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="aesKey" label="AESKey"><Input /></Form.Item>
          <Form.Item name="qrCodeUrl" label="二维码URL"><Input /></Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="ENABLE"><Select><Select.Option value="ENABLE">启用</Select.Option><Select.Option value="DISABLE">禁用</Select.Option></Select></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
