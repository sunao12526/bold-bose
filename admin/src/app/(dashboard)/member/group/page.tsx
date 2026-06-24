'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Tag, Button, Modal, Form, Input, Select, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ApartmentOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

interface GroupRecord {
  id: number;
  name: string;
  status: 'ENABLE' | 'DISABLE';
  description?: string;
  createdAt: string;
}

export default function MemberGroupList() {
  const { tableProps, tableQuery } = useTable<GroupRecord>({
    resource: 'member/group',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GroupRecord | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: GroupRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      status: record.status,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record: GroupRecord) => {
    Modal.confirm({
      title: '确认删除分组',
      content: `您确定要删除分组 "${record.name}" 吗？删除后绑定该分组的会员将变更为无分组状态。`,
      onOk: async () => {
        try {
          await axiosInstance.delete(`/member/group/${record.id}`);
          message.success('删除成功');
          tableQuery.refetch();
        } catch (err: any) {
          message.error(err.response?.data?.message || '删除失败');
        }
      },
    });
  };

  const handleSave = async (values: any) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await axiosInstance.put(`/member/group/${editingRecord.id}`, values);
        message.success('修改分组成功');
      } else {
        await axiosInstance.post('/member/group', values);
        message.success('创建分组成功');
      }
      setIsModalOpen(false);
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建分组
        </Button>
      </div>

      <List title="会员分组管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="name" 
            title="分组名称" 
            render={(name) => (
              <Space>
                <ApartmentOutlined style={{ color: '#08979c' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column dataIndex="description" title="描述" />
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
          <Table.Column
            title="操作"
            key="action"
            width={160}
            render={(_, record: GroupRecord) => (
              <Space>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(record)}
                >
                  编辑
                </Button>
                <Button 
                  type="link" 
                  size="small" 
                  danger
                  icon={<DeleteOutlined />} 
                  onClick={() => handleDelete(record)}
                >
                  删除
                </Button>
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal forceRender
        title={editingRecord ? `编辑分组 - ${editingRecord.name}` : '新建分组'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="name"
            label="分组名称"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="备注描述">
            <Input.TextArea placeholder="请键入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
