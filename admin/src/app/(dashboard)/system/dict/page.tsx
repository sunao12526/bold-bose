'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Row, Col, Card, Empty, Button } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function DictManagement() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // --- DictType Table & Form ---
  const { tableProps: typeTableProps, tableQuery: typeQueryResult } = useTable({
    resource: 'system/dict-type',
    syncWithLocation: false,
  });

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeFormMode, setTypeFormMode] = useState<'create' | 'edit'>('create');

  const handleCreateType = () => {
    setTypeFormMode('create');
    typeForm.resetFields();
    setIsTypeModalOpen(true);
  };

  const handleEditType = (record: any) => {
    setTypeFormMode('edit');
    typeForm.setFieldsValue(record);
    setIsTypeModalOpen(true);
  };

  const { form: typeForm, onFinish: onTypeFinish, formLoading: typeFormLoading } = useForm<any, any, any>({
    resource: 'system/dict-type',
    action: typeFormMode,
    onMutationSuccess: () => {
      setIsTypeModalOpen(false);
      typeQueryResult.refetch();
    },
  });

  // Automatically select the first dict type when loaded
  useEffect(() => {
    const data = typeQueryResult.data?.data;
    if (data && data.length > 0 && !selectedType) {
      setSelectedType(data[0].type);
    }
  }, [typeQueryResult.data, selectedType]);

  // --- DictData Table & Form ---
  const { tableProps: dataTableProps, tableQuery: dataQueryResult } = useTable({
    resource: 'system/dict-data',
    syncWithLocation: false,
    filters: {
      permanent: selectedType ? [{ field: 'dictType', operator: 'eq', value: selectedType }] : [],
    },
    queryOptions: {
      enabled: !!selectedType,
    },
  });

  // Trigger refetch of data table when selected type changes
  useEffect(() => {
    if (selectedType) {
      dataQueryResult.refetch();
    }
  }, [selectedType]);

  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [dataFormMode, setDataFormMode] = useState<'create' | 'edit'>('create');

  const handleCreateData = () => {
    if (!selectedType) return;
    setDataFormMode('create');
    dataForm.resetFields();
    dataForm.setFieldsValue({ dictType: selectedType, status: 'ENABLE' });
    setIsDataModalOpen(true);
  };

  const handleEditData = (record: any) => {
    setDataFormMode('edit');
    dataForm.setFieldsValue(record);
    setIsDataModalOpen(true);
  };

  const { form: dataForm, onFinish: onDataFinish, formLoading: dataFormLoading } = useForm<any, any, any>({
    resource: 'system/dict-data',
    action: dataFormMode,
    onMutationSuccess: () => {
      setIsDataModalOpen(false);
      dataQueryResult.refetch();
    },
  });

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={16}>
        {/* Left Column: DictType */}
        <Col span={10}>
          <Card 
            title="字典类型" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreateType}
              >
                新增类型
              </Button>
            }
          >
            <Table 
              {...typeTableProps} 
              rowKey="id" 
              pagination={false}
              rowClassName={(record) => record.type === selectedType ? 'ant-table-row-selected' : ''}
              onRow={(record) => ({
                onClick: () => setSelectedType(record.type),
                style: { cursor: 'pointer' }
              })}
            >
              <Table.Column dataIndex="name" title="名称" />
              <Table.Column dataIndex="type" title="类型" />
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
                render={(_, record: any) => (
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Button 
                      type="link" 
                      icon={<EditOutlined />} 
                      size="small" 
                      onClick={() => handleEditType(record)} 
                    />
                    <DeleteButton 
                      hideText 
                      size="small" 
                      recordItemId={record.id} 
                      resource="system/dict-type"
                      onSuccess={() => {
                        setSelectedType(null);
                        typeQueryResult.refetch();
                      }}
                    />
                  </Space>
                )}
              />
            </Table>
          </Card>
        </Col>

        {/* Right Column: DictData */}
        <Col span={14}>
          <Card 
            title={selectedType ? `字典数据 [${selectedType}]` : "字典数据"} 
            extra={
              selectedType && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleCreateData}
                >
                  新增数据
                </Button>
              )
            }
          >
            {selectedType ? (
              <Table {...dataTableProps} rowKey="id" pagination={false}>
                <Table.Column dataIndex="label" title="数据标签" />
                <Table.Column dataIndex="value" title="数据键值" />
                <Table.Column dataIndex="sort" title="排序" />
                <Table.Column 
                  dataIndex="colorType" 
                  title="样式属性" 
                  render={(colorType: string) => (
                    colorType ? <Tag color={colorType}>{colorType}</Tag> : '-'
                  )}
                />
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
                  render={(_, record: any) => (
                    <Space>
                      <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        size="small" 
                        onClick={() => handleEditData(record)} 
                      />
                      <DeleteButton 
                        hideText 
                        size="small" 
                        recordItemId={record.id} 
                        resource="system/dict-data"
                        onSuccess={() => dataQueryResult.refetch()}
                      />
                    </Space>
                  )}
                />
              </Table>
            ) : (
              <Empty description="请从左侧选择一个字典类型" />
            )}
          </Card>
        </Col>
      </Row>

      {/* DictType Form Modal */}
      <Modal
        title={typeFormMode === 'create' ? '新增字典类型' : '编辑字典类型'}
        open={isTypeModalOpen}
        onCancel={() => setIsTypeModalOpen(false)}
        onOk={() => typeForm.submit()}
        confirmLoading={typeFormLoading}
      >
        <Form
          form={typeForm}
          layout="vertical"
          onFinish={(values) => onTypeFinish(values)}
        >
          {typeFormMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="name"
            label="字典名称"
            rules={[{ required: true, message: '请输入字典名称' }]}
          >
            <Input placeholder="例如：用户性别" />
          </Form.Item>

          <Form.Item
            name="type"
            label="字典类型"
            rules={[{ required: true, message: '请输入字典类型' }]}
          >
            <Input disabled={typeFormMode === 'edit'} placeholder="例如：sys_user_sex" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* DictData Form Modal */}
      <Modal
        title={dataFormMode === 'create' ? '新增字典数据' : '编辑字典数据'}
        open={isDataModalOpen}
        onCancel={() => setIsDataModalOpen(false)}
        onOk={() => dataForm.submit()}
        confirmLoading={dataFormLoading}
      >
        <Form
          form={dataForm}
          layout="vertical"
          onFinish={(values) => onDataFinish(values)}
        >
          {dataFormMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          <Form.Item name="dictType" hidden><Input /></Form.Item>
          
          <Form.Item
            name="label"
            label="数据标签"
            rules={[{ required: true, message: '请输入数据标签' }]}
          >
            <Input placeholder="例如：男" />
          </Form.Item>

          <Form.Item
            name="value"
            label="数据键值"
            rules={[{ required: true, message: '请输入数据键值' }]}
          >
            <Input placeholder="例如：1" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="显示排序"
            initialValue={0}
            rules={[{ required: true, message: '请输入显示排序' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="colorType" label="颜色标签/样式" initialValue="">
            <Select placeholder="请选择颜色标签样式">
              <Select.Option value="">无</Select.Option>
              <Select.Option value="success">Success (绿)</Select.Option>
              <Select.Option value="processing">Processing (蓝)</Select.Option>
              <Select.Option value="warning">Warning (黄)</Select.Option>
              <Select.Option value="error">Error (红)</Select.Option>
              <Select.Option value="default">Default (灰)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
