'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Select, Tag } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';

export default function DeptList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'system/dept',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // Load status config options
  const { selectProps: statusSelectProps } = useSelect({
    resource: 'system/dict-data',
    optionLabel: 'label',
    optionValue: 'value',
    filters: [{ field: 'dictType', operator: 'eq', value: 'sys_common_status' }],
  });

  // Load potential parents (excluding self in edit mode)
  const { selectProps: parentSelectProps } = useSelect({
    resource: 'system/dept',
    optionLabel: 'name',
    optionValue: 'id',
  });

  // Load users to select as Leader
  const { selectProps: leaderSelectProps } = useSelect({
    resource: 'system/users',
    optionLabel: 'nickname',
    optionValue: 'id',
  });

  // Format the flat department array into a hierarchical tree for table
  const deptsData = tableQueryResult.data?.data || [];
  const buildTree = (list: any[]) => {
    const map: Record<number, any> = {};
    list.forEach(item => {
      map[item.id] = { ...item, key: item.id, children: [] };
    });
    const roots: any[] = [];
    list.forEach(item => {
      const mapped = map[item.id];
      if (item.parentId === 0 || !map[item.parentId]) {
        roots.push(mapped);
      } else {
        map[item.parentId].children.push(mapped);
      }
    });
    const cleanEmptyChildren = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.children.length === 0) {
          delete node.children;
        } else {
          cleanEmptyChildren(node.children);
        }
      });
    };
    cleanEmptyChildren(roots);
    return roots;
  };
  const treeData = buildTree(deptsData);

  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.resetFields();
    form.setFieldsValue({
      ...record,
      leaderId: record.leader?.id || null,
    });
    setIsModalOpen(true);
  };

  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'system/dept',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} dataSource={treeData} rowKey="id" pagination={false}>
          <Table.Column dataIndex="name" title="部门名称" />
          <Table.Column dataIndex="sort" title="排序" width={80} />
          <Table.Column 
            dataIndex="leader" 
            title="负责人" 
            render={(val: any) => val ? val.nickname : '-'} 
          />
          <Table.Column dataIndex="phone" title="电话" />
          <Table.Column dataIndex="email" title="邮箱" />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            render={(val: string) => (
              <Tag color={val === 'ENABLE' ? 'green' : 'red'}>{val === 'ENABLE' ? '启用' : '禁用'}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="创建时间" 
            render={(val: string) => val ? new Date(val).toLocaleString() : '-'}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={120}
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal forceRender
        title={formMode === 'create' ? '新增部门' : '编辑部门'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = { ...values };
            payload.sort = Number(payload.sort || 0);
            payload.parentId = Number(payload.parentId || 0);
            if (payload.leaderId) payload.leaderId = Number(payload.leaderId);
            onFinish(payload);
          }}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item name="name" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }]}>
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item name="parentId" label="上级部门" initialValue={0}>
            <Select placeholder="请选择上级部门">
              <Select.Option value={0}>顶级部门</Select.Option>
              {parentSelectProps.options?.map((opt: any) => (
                <Select.Option key={opt.value} value={opt.value} disabled={formMode === 'edit' && opt.value === form.getFieldValue('id')}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="leaderId" label="负责人">
            <Select placeholder="请选择部门负责人" allowClear {...leaderSelectProps} />
          </Form.Item>

          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item name="email" label="电子邮箱">
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>

          <Form.Item name="sort" label="显示顺序" initialValue={0}>
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入显示顺序" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select placeholder="请选择状态" {...statusSelectProps} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
