'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpTagList() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  
  const { tableProps, tableQuery, setFilters } = useTable({
    resource: 'mp/tag',
    syncWithLocation: false,
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);

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

  // 2. 切换公众号时重新加载标签
  React.useEffect(() => {
    if (selectedAccountId !== null) {
      setFilters([
        {
          field: 'accountId',
          operator: 'eq',
          value: selectedAccountId,
        },
      ]);
    }
  }, [selectedAccountId]);

  const handleCreate = () => {
    if (!selectedAccountId) {
      message.warning('请先选择公众号账号');
      return;
    }
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (r: any) => {
    setEditingId(r.id);
    form.setFieldsValue(r);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingId) {
        // 更新只传 name
        await axiosInstance.put(`/mp/tag/${editingId}`, { name: values.name });
        message.success('修改成功');
      } else {
        // 创建自动带上当前的 accountId
        await axiosInstance.post('/mp/tag', {
          accountId: selectedAccountId,
          name: values.name,
        });
        message.success('创建成功');
      }
      setIsModalOpen(false);
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/mp/tag/${id}`);
      message.success('删除成功');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '删除失败');
    }
  };

  const handleSync = async () => {
    if (!selectedAccountId) {
      message.warning('请先选择公众号');
      return;
    }
    setSyncing(true);
    try {
      await axiosInstance.post(`/mp/tag/sync?accountId=${selectedAccountId}`);
      message.success('标签同步成功');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '同步失败');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>当前公众号：</span>
        <Select
          style={{ width: 220 }}
          placeholder="请选择公众号"
          value={selectedAccountId}
          onChange={(v) => setSelectedAccountId(v)}
          options={accounts.map((a) => ({ label: a.name, value: a.id }))}
        />
      </div>

      <List
        title="标签管理"
        headerProps={{
          extra: (
            <Space>
              <Button type="default" icon={<SyncOutlined spin={syncing} />} onClick={handleSync} loading={syncing}>
                同步标签
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新增标签
              </Button>
            </Space>
          ),
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column dataIndex="tagId" title="微信标签 ID" width={120} />
          <Table.Column dataIndex="name" title="标签名" />
          <Table.Column dataIndex="count" title="粉丝数量" width={100} />
          <Table.Column
            title="操作"
            width={180}
            render={(_, r: any) => (
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)}>编辑</Button>
                <Popconfirm title="确定删除此标签（将同步删除微信云端标签）？" onConfirm={() => handleDelete(r.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={editingId ? '编辑标签' : '新增标签'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="标签名称" rules={[{ required: true, message: '请输入标签名称' }]}>
            <Input maxLength={30} placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
