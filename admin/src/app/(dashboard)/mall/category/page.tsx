'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, TreeSelect, Image } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { AppstoreOutlined } from '@ant-design/icons';

export default function CategoryList() {
  const { tableProps } = useTable({
    resource: 'mall/category',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const { onFinish, formLoading } = useForm({
    resource: 'mall/category',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const rawCategories = tableProps.dataSource || [];

  const buildTree = (list: any[]) => {
    const map: any = {};
    list.forEach((c) => {
      map[c.id] = { ...c, key: c.id, value: c.id, title: c.name, children: [] };
    });
    const tree: any[] = [];
    list.forEach((c) => {
      if (c.parentId) {
        if (map[c.parentId]) {
          map[c.parentId].children.push(map[c.id]);
        } else {
          // If parent is not found in the list, treat as root
          tree.push(map[c.id]);
        }
      } else {
        tree.push(map[c.id]);
      }
    });

    const cleanEmptyChildren = (nodes: any[]) => {
      nodes.forEach((n) => {
        if (n.children.length === 0) {
          delete n.children;
        } else {
          cleanEmptyChildren(n.children);
        }
      });
    };
    cleanEmptyChildren(tree);
    return tree;
  };

  const categoryTree = buildTree(rawCategories as any[]);

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table 
          {...tableProps} 
          dataSource={categoryTree} 
          pagination={false}
          rowKey="id"
        >
          <Table.Column 
            dataIndex="name" 
            title="分类名称" 
            render={(name: string, record: any) => (
              <Space>
                <AppstoreOutlined style={{ color: '#1677ff' }} />
                <span style={{ fontWeight: record.parentId ? 'normal' : '600' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column 
            dataIndex="picUrl" 
            title="分类图片" 
            render={(url: string) => url ? (
              <Image 
                src={url} 
                alt="分类图片" 
                width={40} 
                height={40} 
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                fallback="https://placehold.co/100x100?text=No+Image"
              />
            ) : <span style={{ color: '#ccc' }}>-</span>}
          />
          <Table.Column dataIndex="sort" title="排序" width={100} />
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
          <Table.Column dataIndex="remark" title="备注" />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={160}
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增分类' : '编辑分类'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onFinish(values);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="parentId"
            label="上级分类"
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择上级分类（留空代表顶级分类）"
              allowClear
              treeDefaultExpandAll
              treeData={categoryTree}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item 
            name="picUrl" 
            label="分类图片 URL"
          >
            <Input placeholder="请输入图片 URL（如 /category/digital.png）" />
          </Form.Item>

          <Form.Item name="sort" label="显示排序" initialValue={0}>
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
