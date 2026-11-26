'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { TagsOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthFunctionList() {
  const { tableProps } = useTable({
    resource: 'health-rd/function',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 90,
      render: (val: string) => <Tag color="default">{val}</Tag>,
    },
    {
      title: '功能类别',
      dataIndex: 'categoryName',
      width: 140,
      render: (val: string) => <Text strong style={{ color: '#1677ff' }}>{val}</Text>,
    },
    {
      title: '研发功能',
      dataIndex: 'rdFunction',
      width: 150,
    },
    {
      title: '法规允许功能',
      dataIndex: 'legalFunction',
      width: 150,
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: '营销表达词',
      dataIndex: 'marketingExpr',
      width: 150,
      render: (val: string) => <Tag color="orange">{val}</Tag>,
    },
    {
      title: '关联原料',
      dataIndex: 'relatedMaterials',
      width: 180,
      ellipsis: true,
      render: (val: string) => <Text style={{ color: '#52c41a' }}>{val}</Text>,
    },
    {
      title: '典型产品方向',
      dataIndex: 'typicalDirection',
      ellipsis: true,
    },
  ];

  const exportColumns = [
    { title: '编号', dataIndex: 'code' },
    { title: '功能类别', dataIndex: 'categoryName' },
    { title: '研发功能', dataIndex: 'rdFunction' },
    { title: '法规允许功能', dataIndex: 'legalFunction' },
    { title: '营销表达', dataIndex: 'marketingExpr' },
    { title: '法规允许宣称', dataIndex: 'legalClaim' },
    { title: '关联原料', dataIndex: 'relatedMaterials' },
    { title: '关联活性成分', dataIndex: 'relatedIngredients' },
    { title: '典型产品方向', dataIndex: 'typicalDirection' },
    { title: '法规风险提示', dataIndex: 'riskWarning' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <TagsOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
            <span>健康功能分类表 (研发/法规/营销三分隔离库)</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/function"
            columns={exportColumns}
            filename="健康功能分类"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
