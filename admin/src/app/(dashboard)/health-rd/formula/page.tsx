'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthFormulaList() {
  const { tableProps } = useTable({
    resource: 'health-rd/formula',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '配方编号',
      dataIndex: 'code',
      width: 100,
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      width: 160,
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: '产品定位',
      dataIndex: 'positioning',
      width: 200,
    },
    {
      title: '目标人群',
      dataIndex: 'targetCrowd',
      width: 130,
      render: (val: string) => <Tag color="gold">{val}</Tag>,
    },
    {
      title: '核心原料',
      dataIndex: 'coreMaterials',
      width: 180,
      render: (val: string) => <Text style={{ color: '#52c41a' }}>{val}</Text>,
    },
    {
      title: '剂型',
      dataIndex: 'dosageForm',
      width: 110,
      render: (val: string) => <Tag color="cyan">{val}</Tag>,
    },
    {
      title: '理论依据',
      dataIndex: 'theoreticalBasis',
      ellipsis: true,
    },
    {
      title: '验证状态',
      dataIndex: 'validationStatus',
      width: 120,
      render: (val: string) => <Tag color="green">{val || '开发中'}</Tag>,
    },
  ];

  const exportColumns = [
    { title: '配方编号', dataIndex: 'code' },
    { title: '产品名称', dataIndex: 'name' },
    { title: '产品定位', dataIndex: 'positioning' },
    { title: '目标人群', dataIndex: 'targetCrowd' },
    { title: '核心原料', dataIndex: 'coreMaterials' },
    { title: '原料添加量', dataIndex: 'dosagePerUnit' },
    { title: '每日摄入量', dataIndex: 'dailyIntake' },
    { title: '有效成分目标', dataIndex: 'activeTarget' },
    { title: '剂型', dataIndex: 'dosageForm' },
    { title: '提取倍率', dataIndex: 'extractionRatio' },
    { title: '质量标准', dataIndex: 'qualityStandard' },
    { title: '理论依据', dataIndex: 'theoreticalBasis' },
    { title: '验证状态', dataIndex: 'validationStatus' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ShopOutlined style={{ color: '#faad14', fontSize: '20px' }} />
            <span>大健康战略产品配方库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/formula"
            columns={exportColumns}
            filename="产品配方库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
