'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthIngredientList() {
  const { tableProps } = useTable({
    resource: 'health-rd/ingredient',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '成分名称',
      dataIndex: 'name',
      width: 140,
      render: (text: string) => <Text strong style={{ color: '#52c41a' }}>{text}</Text>,
    },
    {
      title: 'CAS号',
      dataIndex: 'casNo',
      width: 120,
      render: (text: string) => <Tag color="geekblue">{text || '暂无'}</Tag>,
    },
    {
      title: '来源原料',
      dataIndex: 'sourceMaterial',
      width: 120,
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: '成分类别',
      dataIndex: 'category',
      width: 120,
    },
    {
      title: '化学分类',
      dataIndex: 'chemCategory',
      width: 130,
    },
    {
      title: '研究方向',
      dataIndex: 'researchDir',
      width: 150,
    },
    {
      title: '作用机制',
      dataIndex: 'mechanism',
      ellipsis: true,
    },
    {
      title: '证据等级',
      dataIndex: 'evidenceLevel',
      width: 100,
      render: (text: string) => <Tag color="magenta">{text || 'A'}</Tag>,
    },
  ];

  const exportColumns = [
    { title: '成分名称', dataIndex: 'name' },
    { title: 'CAS号', dataIndex: 'casNo' },
    { title: '来源原料', dataIndex: 'sourceMaterial' },
    { title: '成分类别', dataIndex: 'category' },
    { title: '化学分类', dataIndex: 'chemCategory' },
    { title: '研究方向', dataIndex: 'researchDir' },
    { title: '作用机制', dataIndex: 'mechanism' },
    { title: '证据等级', dataIndex: 'evidenceLevel' },
    { title: '临床证据', dataIndex: 'clinicalEvidence' },
    { title: '分子式/结构特征', dataIndex: 'formulaStructure' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ExperimentOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
            <span>天然活性成分知识库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/ingredient"
            columns={exportColumns}
            filename="天然活性成分知识库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
