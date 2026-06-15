'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Button, Tree, message } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { KeyOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

export default function RoleList() {
  const { tableProps } = useTable({
    resource: 'system/role',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState<number | null>(null);
  const [menuTreeData, setMenuTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

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
    resource: 'system/role',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const handleAssignPermissions = async (role: any) => {
    setCurrentRoleId(role.id);
    try {
      const menusRes = await axiosInstance.get('/system/menu');
      const menus = menusRes.data;

      const map: any = {};
      menus.forEach((m: any) => {
        map[m.id] = { ...m, key: m.id, title: m.name, children: [] };
      });
      const tree: any[] = [];
      menus.forEach((m: any) => {
        if (m.parentId) {
          map[m.parentId]?.children.push(map[m.id]);
        } else {
          tree.push(map[m.id]);
        }
      });
      setMenuTreeData(tree);

      const roleRes = await axiosInstance.get(`/system/role/${role.id}`);
      const selectedMenuIds = roleRes.data.menus?.map((m: any) => m.menuId) || [];
      setCheckedKeys(selectedMenuIds);

      setIsPermModalOpen(true);
    } catch (err) {
      message.error('加载权限数据失败');
    }
  };

  const handleSavePermissions = async () => {
    if (!currentRoleId) return;
    try {
      await axiosInstance.post(`/system/role/${currentRoleId}/assign-menus`, {
        menuIds: checkedKeys.map(Number),
      });
      message.success('保存权限成功');
      setIsPermModalOpen(false);
    } catch (err) {
      message.error('保存权限失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="name" title="角色名称" />
          <Table.Column dataIndex="code" title="权限字符" />
          <Table.Column dataIndex="sort" title="显示顺序" />
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
                <Button 
                  icon={<KeyOutlined />} 
                  size="small" 
                  onClick={() => handleAssignPermissions(record)}
                  title="分配权限"
                />
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal forceRender
        title={formMode === 'create' ? '新增角色' : '编辑角色'}
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
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="权限字符"
            rules={[{ required: true, message: '请输入权限字符' }]}
          >
            <Input disabled={formMode === 'edit'} />
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

          <Form.Item name="remark" label="备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="分配权限"
        open={isPermModalOpen}
        onCancel={() => setIsPermModalOpen(false)}
        onOk={handleSavePermissions}
      >
        <Tree
          checkable
          checkStrictly
          defaultExpandAll
          treeData={menuTreeData}
          checkedKeys={checkedKeys}
          onCheck={(checked: any) => {
            setCheckedKeys(checked.checked || checked);
          }}
        />
      </Modal>
    </div>
  );
}
