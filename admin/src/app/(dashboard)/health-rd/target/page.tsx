'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthTargetList() {
  const { tableProps } = useTable({
    resource: 'health-rd/target',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '活性成分',
      dataIndex: 'activeIngredient',
      width: 140,
      render: (val: string) => <Text strong style={{ color: '#1677ff' }}>{val}</Text>,
    },
    {
      title: '作用靶点',
      dataIndex: 'targetName',
      width: 130,
      render: (val: string) => <Tag color="purple" style={{ fontSize: '13px' }}>{val}</Tag>,
    },
    {
      title: '信号通路',
      dataIndex: 'signalPathway',
      width: 200,
      render: (val: string) => <Text code>{val}</Text>,
    },
    {
      title: '疾病/功能领域',
      dataIndex: 'diseaseDomain',
      width: 160,
      render: (val: string) => <Tag color="green">{val}</Tag>,
    },
    {
      title: '作用类型',
      dataIndex: 'actionType',
      width: 110,
      render: (val: string) => <Tag color="orange">{val || '调节剂'}</Tag>,
    },
    {
      title: '证据等级',
      dataIndex: 'evidenceLevel',
      width: 100,
      render: (val: string) => <Tag color="magenta">{val}</Tag>,
    },
    {
      title: '关键文献/依据',
      dataIndex: 'keyLiterature',
      ellipsis: true,
    },
  ];

  const exportColumns = [
    { title: '活性成分', dataIndex: 'activeIngredient' },
    { title: '作用靶点', dataIndex: 'targetName' },
    { title: '信号通路', dataIndex: 'signalPathway' },
    { title: '疾病/功能领域', dataIndex: 'diseaseDomain' },
    { title: '作用类型', dataIndex: 'actionType' },
    { title: '证据等级', dataIndex: 'evidenceLevel' },
    { title: '关键文献依据', dataIndex: 'keyLiterature' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#722ed1', fontSize: '20px' }} />
            <span>作用靶点与信号通路数据库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/target"
            columns={exportColumns}
            filename="作用靶点数据库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
