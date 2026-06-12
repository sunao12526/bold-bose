'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Button, message } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { CheckCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function FileConfigList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'infra/file-config',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedStorage, setSelectedStorage] = useState<'LOCAL' | 'S3'>('LOCAL');
  const [form] = Form.useForm();

  const handleCreate = () => {
    setFormMode('create');
    setSelectedStorage('LOCAL');
    form.resetFields();
    form.setFieldsValue({ storage: 'LOCAL', baseFolder: './uploads', domain: 'http://localhost:3000' });
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    setSelectedStorage(record.storage);
    form.resetFields();
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      storage: record.storage,
      remark: record.remark,
      ...record.config,
    });
    setIsModalOpen(true);
  };

  const { onFinish, formLoading } = useForm({
    resource: 'infra/file-config',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  const handleSetMaster = async (id: number) => {
    try {
      await axiosInstance.put(`/infra/file-config/${id}/set-master`);
      message.success('已切换默认主存储配置');
      tableQueryResult.refetch();
    } catch (err) {
      console.error(err);
      message.error('切换存储配置失败');
    }
  };

  const handleSubmit = (values: any) => {
    const { id, name, storage, remark, ...config } = values;
    const payload = {
      name,
      storage,
      remark,
      config,
    };
    onFinish(payload);
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
          <Table.Column dataIndex="name" title="配置名称" />
          <Table.Column 
            dataIndex="storage" 
            title="存储器" 
            render={(storage: string) => (
              <Tag color={storage === 'LOCAL' ? 'orange' : 'cyan'}>
                {storage === 'LOCAL' ? '本地存储' : 'S3兼容存储'}
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="master" 
            title="默认配置" 
            render={(master: boolean, record: any) => (
              master ? (
                <Tag color="green" icon={<CheckCircleOutlined />}>默认主配置</Tag>
              ) : (
                <Button 
                  size="small" 
                  onClick={() => handleSetMaster(record.id)}
                >
                  设为默认
                </Button>
              )
            )}
          />
          <Table.Column 
            dataIndex="config" 
            title="存储配置" 
            render={(config: any, record: any) => {
              if (record.storage === 'LOCAL') {
                return `目录: ${config.baseFolder || '-'}`;
              } else {
                return `Bucket: ${config.bucket || '-'} / EndPoint: ${config.endpoint || '-'}`;
              }
            }}
          />
          <Table.Column dataIndex="remark" title="备注" ellipsis />
          <Table.Column
            title="操作"
            dataIndex="actions"
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} disabled={record.master} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增文件配置' : '编辑文件配置'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="name"
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input placeholder="例如：本地存储、SeaweedFS存储" />
          </Form.Item>

          <Form.Item
            name="storage"
            label="存储类型"
            rules={[{ required: true, message: '请选择存储类型' }]}
          >
            <Select onChange={(val) => setSelectedStorage(val)}>
              <Select.Option value="LOCAL">本地存储 (LOCAL)</Select.Option>
              <Select.Option value="S3">S3兼容存储 (MinIO/SeaweedFS/OSS)</Select.Option>
            </Select>
          </Form.Item>

          {/* Dynamic Configuration Form Fields */}
          {selectedStorage === 'LOCAL' && (
            <>
              <Form.Item
                name="baseFolder"
                label="基础文件夹路径"
                rules={[{ required: true, message: '请输入存储文件夹路径' }]}
                initialValue="./uploads"
              >
                <Input placeholder="默认：./uploads" />
              </Form.Item>
              <Form.Item
                name="domain"
                label="文件域名/访问前缀"
                rules={[{ required: true, message: '请输入文件域名' }]}
                initialValue="http://localhost:3000"
              >
                <Input placeholder="默认：http://localhost:3000" />
              </Form.Item>
            </>
          )}

          {selectedStorage === 'S3' && (
            <>
              <Form.Item
                name="endpoint"
                label="EndPoint (节点地址)"
                rules={[{ required: true, message: '请输入 S3 节点地址' }]}
              >
                <Input placeholder="例如：http://localhost:8333" />
              </Form.Item>
              <Form.Item
                name="bucket"
                label="Bucket (桶名)"
                rules={[{ required: true, message: '请输入 Bucket 名称' }]}
              >
                <Input placeholder="例如：bold-bose" />
              </Form.Item>
              <Form.Item
                name="accessKey"
                label="Access Key (密钥ID)"
                rules={[{ required: true, message: '请输入 Access Key' }]}
              >
                <Input placeholder="存储访问的授权 Access Key" />
              </Form.Item>
              <Form.Item
                name="secretKey"
                label="Secret Key (密钥内容)"
                rules={[{ required: true, message: '请输入 Secret Key' }]}
              >
                <Input.Password placeholder="存储访问的授权 Secret Key" />
              </Form.Item>
              <Form.Item
                name="domain"
                label="文件域名/访问URL前缀"
                rules={[{ required: true, message: '请输入访问前缀' }]}
              >
                <Input placeholder="S3文件外链前缀。例如：http://localhost:8333/bold-bose" />
              </Form.Item>
            </>
          )}

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="参数配置的补充说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
