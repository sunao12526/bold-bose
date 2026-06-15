'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, TreeSelect } from 'antd';
import { useTable, useForm } from '@refinedev/antd';

export default function MenuList() {
  const { tableProps } = useTable({
    resource: 'system/menu',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
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

  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'system/menu',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const rawMenus = tableProps.dataSource || [];
  
  const buildTree = (list: any[]) => {
    const map: any = {};
    list.forEach((m) => {
      map[m.id] = { ...m, key: m.id, value: m.id, title: m.name, children: [] };
    });
    const tree: any[] = [];
    list.forEach((m) => {
      if (m.parentId) {
        map[m.parentId]?.children.push(map[m.id]);
      } else {
        tree.push(map[m.id]);
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

  const menuTree = buildTree(rawMenus as any[]);

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table 
          {...tableProps} 
          dataSource={menuTree} 
          pagination={false}
          rowKey="id"
        >
          <Table.Column dataIndex="name" title="菜单名称" />
          <Table.Column 
            dataIndex="type" 
            title="类型" 
            render={(type: string) => {
              const colors: any = { DIR: 'blue', MENU: 'green', BUTTON: 'orange' };
              const labels: any = { DIR: '目录', MENU: '菜单', BUTTON: '按钮' };
              return <Tag color={colors[type]}>{labels[type]}</Tag>;
            }}
          />
          <Table.Column dataIndex="permission" title="权限标识" />
          <Table.Column dataIndex="path" title="路由地址" />
          <Table.Column dataIndex="component" title="组件路径" />
          <Table.Column dataIndex="sort" title="排序" />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            render={(status: string) => (
              <Tag color={status === 'ENABLE' ? 'green' : 'red'}>
                {status === 'ENABLE' ? '启用' : '禁用'}
              </Tag>
            )}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal forceRender
        title={formMode === 'create' ? '新增菜单' : '编辑菜单'}
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
            label="上级菜单"
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              styles={{ popup: { root: { maxHeight: 400, overflow: 'auto' } } }}
              placeholder="请选择上级菜单"
              allowClear
              treeDefaultExpandAll
              treeData={menuTree}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="菜单类型"
            initialValue="MENU"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="DIR">目录</Select.Option>
              <Select.Option value="MENU">菜单</Select.Option>
              <Select.Option value="BUTTON">按钮</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="permission" label="权限标识" tooltip="例如 system:user:create">
            <Input />
          </Form.Item>

          <Form.Item name="path" label="路由地址" tooltip="例如 /system/user">
            <Input />
          </Form.Item>

          <Form.Item name="component" label="组件路径" tooltip="例如 system/user/index">
            <Input />
          </Form.Item>

          <Form.Item name="icon" label="图标">
            <Input placeholder="输入 Antd 图标类名，如 SettingOutlined" />
          </Form.Item>

          <Form.Item name="sort" label="显示顺序" initialValue={0}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
