'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List, DeleteButton } from '@refinedev/antd';
import { Table, Space, Upload, Button, Tag, Image, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';

export default function FileList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'infra/file',
    syncWithLocation: true,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:3000/admin-api/infra/file/upload',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    showUploadList: false,
    onChange(info: any) {
      if (info.file.status === 'uploading') {
        // Option to show loading indicator if desired
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        tableQueryResult.refetch();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: (
            <Upload {...uploadProps}>
              <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          ),
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="url" 
            title="预览" 
            width={120}
            render={(url: string, record: any) => {
              const isImage = record.type?.startsWith('image/');
              return isImage ? (
                <Image 
                  src={url} 
                  alt={record.name} 
                  width={60} 
                  height={60} 
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                  fallback="https://placehold.co/60x60?text=Image"
                />
              ) : (
                <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <FileOutlined style={{ fontSize: 24, color: '#999' }} />
                </div>
              );
            }}
          />
          <Table.Column dataIndex="name" title="文件名" ellipsis />
          <Table.Column 
            dataIndex="path" 
            title="存储路径" 
            ellipsis 
            render={(path: string) => <code style={{ fontSize: '12px' }}>{path}</code>}
          />
          <Table.Column 
            dataIndex="size" 
            title="文件大小" 
            width={120}
            render={(size: number) => formatSize(size)}
          />
          <Table.Column 
            dataIndex="type" 
            title="文件类型" 
            width={150}
            render={(type: string) => <Tag color="blue">{type || '未知'}</Tag>}
          />
          <Table.Column 
            dataIndex="config" 
            title="存储器" 
            width={180}
            render={(config: any) => (
              config ? (
                <Tag color={config.storage === 'LOCAL' ? 'orange' : 'cyan'}>
                  {config.name} ({config.storage})
                </Tag>
              ) : '-'
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="上传时间" 
            width={180}
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={100}
            render={(_, record: any) => (
              <Space>
                <Button type="link" size="small" href={record.url} target="_blank" rel="noreferrer">
                  下载
                </Button>
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>
    </div>
  );
}
