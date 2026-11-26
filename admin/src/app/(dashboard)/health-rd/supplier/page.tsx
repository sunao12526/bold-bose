'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthSupplierList() {
  const { tableProps } = useTable({
    resource: 'health-rd/supplier',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '原料名称',
      dataIndex: 'materialName',
      width: 120,
      render: (val: string) => <Tag color="green">{val}</Tag>,
    },
    {
      title: '供应商(示例)',
      dataIndex: 'supplierName',
      width: 180,
      render: (val: string) => <Text strong style={{ color: '#1677ff' }}>{val}</Text>,
    },
    {
      title: '产地',
      dataIndex: 'origin',
      width: 120,
    },
    {
      title: '年产量(估)',
      dataIndex: 'annualCapacity',
      width: 120,
    },
    {
      title: 'GMP认证',
      dataIndex: 'gmpCertified',
      width: 100,
      render: (val: string) => <Tag color={val === '是' ? 'blue' : 'default'}>{val}</Tag>,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: 110,
      render: (val: string) => <Tag color={val === '已审核' ? 'green' : 'orange'}>{val}</Tag>,
    },
    {
      title: 'COA能力',
      dataIndex: 'coaCapacity',
      width: 130,
    },
    {
      title: '参考价格',
      dataIndex: 'price',
      width: 130,
      render: (val: string) => <Text type="danger">{val}</Text>,
    },
    {
      title: '供应稳定性',
      dataIndex: 'supplyStability',
      width: 120,
      render: (val: string) => <Text style={{ color: '#fa8c16' }}>{val}</Text>,
    },
  ];

  const exportColumns = [
    { title: '原料名称', dataIndex: 'materialName' },
    { title: '供应商名称', dataIndex: 'supplierName' },
    { title: '产地', dataIndex: 'origin' },
    { title: '年产量', dataIndex: 'annualCapacity' },
    { title: 'GMP认证', dataIndex: 'gmpCertified' },
    { title: '质量体系', dataIndex: 'qualitySystem' },
    { title: '审核状态', dataIndex: 'auditStatus' },
    { title: '审计日期', dataIndex: 'auditDate' },
    { title: 'COA能力', dataIndex: 'coaCapacity' },
    { title: '参考价格', dataIndex: 'price' },
    { title: '供应稳定性', dataIndex: 'supplyStability' },
    { title: '合作状态', dataIndex: 'coopStatus' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <SolutionOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
            <span>原料供应链与 COA 审核数据库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/supplier"
            columns={exportColumns}
            filename="供应链数据库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
