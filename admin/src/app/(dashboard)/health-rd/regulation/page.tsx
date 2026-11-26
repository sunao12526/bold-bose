'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { ControlOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthRegulationList() {
  const { tableProps } = useTable({
    resource: 'health-rd/regulation',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '法规名称',
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
      render: (val: string) => <Text strong style={{ color: '#13c2c2' }}>{val}</Text>,
    },
    {
      title: '发布部门',
      dataIndex: 'publisher',
      width: 140,
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      width: 110,
    },
    {
      title: '法规编号',
      dataIndex: 'codeNo',
      width: 160,
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: '涉及原料',
      dataIndex: 'materials',
      width: 180,
      ellipsis: true,
      render: (val: string) => <Text style={{ color: '#52c41a' }}>{val}</Text>,
    },
    {
      title: '限制要求与用法规范',
      dataIndex: 'restrictions',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (val: string) => <Tag color="green">{val || '现行有效'}</Tag>,
    },
  ];

  const exportColumns = [
    { title: '法规名称', dataIndex: 'name' },
    { title: '发布部门', dataIndex: 'publisher' },
    { title: '发布日期', dataIndex: 'publishDate' },
    { title: '法规编号', dataIndex: 'codeNo' },
    { title: '适用范围', dataIndex: 'scope' },
    { title: '涉及原料', dataIndex: 'materials' },
    { title: '限制要求', dataIndex: 'restrictions' },
    { title: '法规状态', dataIndex: 'status' },
    { title: '法规链接', dataIndex: 'url' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ControlOutlined style={{ color: '#13c2c2', fontSize: '20px' }} />
            <span>食药法规知识与合规准入数据库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/regulation"
            columns={exportColumns}
            filename="法规知识库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
