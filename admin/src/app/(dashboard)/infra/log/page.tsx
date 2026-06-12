'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Descriptions, Tag } from 'antd';
import { useTable } from '@refinedev/antd';
import { EyeOutlined } from '@ant-design/icons';

export default function LogList() {
  const { tableProps } = useTable({
    resource: 'infra/log',
    syncWithLocation: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'green';
      case 'POST': return 'blue';
      case 'PUT': return 'orange';
      case 'DELETE': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column 
            dataIndex="username" 
            title="操作人" 
            width={120} 
            render={(username: string) => username || '未登录用户'}
          />
          <Table.Column dataIndex="module" title="系统模块" width={120} />
          <Table.Column 
            dataIndex="type" 
            title="操作类型" 
            width={120}
            render={(type: string) => <Tag>{type}</Tag>}
          />
          <Table.Column dataIndex="description" title="操作描述" ellipsis />
          <Table.Column 
            dataIndex="method" 
            title="请求方式" 
            width={100}
            render={(method: string) => (
              <Tag color={getMethodColor(method)}>{method}</Tag>
            )}
          />
          <Table.Column dataIndex="path" title="请求路径" ellipsis />
          <Table.Column dataIndex="ip" title="主机地址" width={130} />
          <Table.Column 
            dataIndex="status" 
            title="操作状态" 
            width={100}
            render={(status: number) => (
              <Tag color={status === 200 ? 'green' : 'red'}>
                {status === 200 ? '成功' : `异常(${status})`}
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="duration" 
            title="执行耗时" 
            width={120}
            render={(duration: number) => (
              <span style={{ color: duration > 1000 ? '#f5222d' : 'inherit' }}>
                {duration} ms
              </span>
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="操作时间" 
            width={180}
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            title="操作"
            width={80}
            render={(_, record: any) => (
              <Button 
                type="link" 
                icon={<EyeOutlined />} 
                size="small" 
                onClick={() => handleViewDetail(record)}
              >
                详情
              </Button>
            )}
          />
        </Table>
      </List>

      <Modal
        title="操作日志详情"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedRecord && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="日志编号" span={2}>{selectedRecord.id}</Descriptions.Item>
            <Descriptions.Item label="操作人员">{selectedRecord.username || '未登录用户'}</Descriptions.Item>
            <Descriptions.Item label="用户编号">{selectedRecord.userId || '-'}</Descriptions.Item>
            <Descriptions.Item label="系统模块">{selectedRecord.module}</Descriptions.Item>
            <Descriptions.Item label="操作类型">{selectedRecord.type}</Descriptions.Item>
            <Descriptions.Item label="操作描述" span={2}>{selectedRecord.description}</Descriptions.Item>
            <Descriptions.Item label="请求路径" span={2}>
              <code style={{ wordBreak: 'break-all' }}>{selectedRecord.path}</code>
            </Descriptions.Item>
            <Descriptions.Item label="请求方式">
              <Tag color={getMethodColor(selectedRecord.method)}>{selectedRecord.method}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作 IP">{selectedRecord.ip}</Descriptions.Item>
            <Descriptions.Item label="操作状态">
              <Tag color={selectedRecord.status === 200 ? 'green' : 'red'}>
                {selectedRecord.status === 200 ? '成功' : '失败'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="操作耗时">{selectedRecord.duration} ms</Descriptions.Item>
            <Descriptions.Item label="操作时间" span={2}>
              {new Date(selectedRecord.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
