'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Button, Tag, Divider, Card } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { PlusOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons';

interface PropertyValue {
  id?: number;
  value: string;
}

interface PropertyRecord {
  id: number;
  name: string;
  remark?: string;
  values?: PropertyValue[];
}

export default function PropertyList() {
  const { tableProps } = useTable<PropertyRecord>({
    resource: 'mall/property',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    // Start with one default property value field
    form.setFieldsValue({ values: [{ value: '' }] });
    setIsModalOpen(true);
  };

  const handleEdit = (record: PropertyRecord) => {
    setFormMode('edit');
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      remark: record.remark,
      values: record.values && record.values.length > 0 ? record.values : [{ value: '' }],
    });
    setIsModalOpen(true);
  };

  const { form, onFinish, formLoading } = useForm<PropertyRecord>({
    resource: 'mall/property',
    action: formMode,
    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const handleFormSubmit = (values: any) => {
    // Filter out empty property values
    const filteredValues = (values.values || []).filter((v: any) => v && v.value && v.value.trim() !== '');
    
    if (formMode === 'create') {
      // Create endpoint expects a string array for values
      onFinish({
        ...values,
        values: filteredValues.map((v: any) => v.value.trim()),
      });
    } else {
      // Update endpoint expects { id?: number; value: string }[]
      onFinish({
        ...values,
        values: filteredValues.map((v: any) => ({
          id: v.id,
          value: v.value.trim(),
        })),
      });
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
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="name" 
            title="规格名称" 
            width={180}
            render={(name: string) => (
              <Space>
                <TagsOutlined style={{ color: '#722ed1' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column 
            dataIndex="values" 
            title="规格值" 
            render={(values: PropertyValue[]) => (
              <Space size={[0, 8]} wrap>
                {values && values.length > 0 ? (
                  values.map((v) => (
                    <Tag color="purple" key={v.id}>
                      {v.value}
                    </Tag>
                  ))
                ) : (
                  <span style={{ color: '#ccc' }}>-</span>
                )}
              </Space>
            )}
          />
          <Table.Column dataIndex="remark" title="备注" />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={160}
            render={(_, record: PropertyRecord) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增规格' : '编辑规格'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="name"
            label="规格名称"
            rules={[{ required: true, message: '请输入规格名称，例如：颜色、尺寸' }]}
          >
            <Input placeholder="请输入规格名称，如 颜色、尺寸" />
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input placeholder="请输入说明" />
          </Form.Item>

          <Divider style={{ margin: '16px 0' }} />

          <Card title="规格值列表" size="small" styles={{ body: { padding: '12px' } }}>
            <Form.List name="values">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space 
                      key={key} 
                      style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }} 
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true, message: '请输入规格值' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="规格值，例如：红色、XL" style={{ width: 380 }} />
                      </Form.Item>
                      {/* Hidden id field to track existing values on edit */}
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        hidden
                      >
                        <Input />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)} 
                        />
                      )}
                    </Space>
                  ))}
                  <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
                    <Button 
                      type="dashed" 
                      onClick={() => add({ value: '' })} 
                      block 
                      icon={<PlusOutlined />}
                    >
                      添加规格值
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      </Modal>
    </div>
  );
}
