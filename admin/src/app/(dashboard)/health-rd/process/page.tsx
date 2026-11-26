'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthProcessList() {
  const { tableProps } = useTable({
    resource: 'health-rd/process',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '原料名称',
      dataIndex: 'materialName',
      width: 130,
      render: (val: string) => <Text strong style={{ color: '#1677ff' }}>{val}</Text>,
    },
    {
      title: '目标提取成分',
      dataIndex: 'targetComponent',
      width: 140,
      render: (val: string) => <Tag color="geekblue">{val}</Tag>,
    },
    {
      title: '提取溶剂',
      dataIndex: 'solvent',
      width: 110,
    },
    {
      title: '提取温度/时间',
      dataIndex: 'temperature',
      width: 150,
      render: (val: string, record: any) => `${val || '-'} / ${record.duration || '-'}`,
    },
    {
      title: '关键工艺参数',
      dataIndex: 'keyParams',
      width: 180,
      ellipsis: true,
    },
    {
      title: '收率/转移率',
      dataIndex: 'yieldRate',
      width: 120,
      render: (val: string) => <Tag color="green">{val}</Tag>,
    },
    {
      title: '中试放大风险',
      dataIndex: 'scaleUpRisk',
      ellipsis: true,
    },
    {
      title: '关键控制点(CCP)',
      dataIndex: 'criticalControl',
      ellipsis: true,
    },
  ];

  const exportColumns = [
    { title: '原料名称', dataIndex: 'materialName' },
    { title: '目标成分', dataIndex: 'targetComponent' },
    { title: '提取溶剂', dataIndex: 'solvent' },
    { title: '提取温度', dataIndex: 'temperature' },
    { title: '提取时间', dataIndex: 'duration' },
    { title: '关键工艺参数', dataIndex: 'keyParams' },
    { title: '质量指标', dataIndex: 'qualityIndex' },
    { title: '收率/转移率', dataIndex: 'yieldRate' },
    { title: '实验规模', dataIndex: 'labScale' },
    { title: '中试规模', dataIndex: 'pilotScale' },
    { title: '放大风险', dataIndex: 'scaleUpRisk' },
    { title: '关键控制点', dataIndex: 'criticalControl' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ToolOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
            <span>提取与中试放大工艺技术数据库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/process"
            columns={exportColumns}
            filename="工艺技术数据库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
