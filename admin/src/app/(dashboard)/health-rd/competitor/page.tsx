'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthCompetitorList() {
  const { tableProps } = useTable({
    resource: 'health-rd/competitor',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '标杆竞品名称',
      dataIndex: 'name',
      width: 160,
      render: (val: string) => <Text strong style={{ color: '#fa8c16' }}>{val}</Text>,
    },
    {
      title: '品牌/企业',
      dataIndex: 'brand',
      width: 140,
      render: (val: string, record: any) => `${val || '-'} (${record.company || '-'})`,
    },
    {
      title: '功能定位',
      dataIndex: 'functionPos',
      width: 180,
    },
    {
      title: '主要成分',
      dataIndex: 'mainIngredients',
      width: 160,
      render: (val: string) => <Tag color="green">{val}</Tag>,
    },
    {
      title: '剂型',
      dataIndex: 'dosageForm',
      width: 90,
    },
    {
      title: '参考售价',
      dataIndex: 'price',
      width: 110,
      render: (val: string) => <Text type="danger" strong>{val}</Text>,
    },
    {
      title: '全网与电商热度',
      dataIndex: 'socialHeat',
      ellipsis: true,
    },
    {
      title: '研发机会点分析',
      dataIndex: 'opportunity',
      ellipsis: true,
    },
  ];

  const exportColumns = [
    { title: '标杆竞品名称', dataIndex: 'name' },
    { title: '生产企业', dataIndex: 'company' },
    { title: '品牌', dataIndex: 'brand' },
    { title: '功能定位', dataIndex: 'functionPos' },
    { title: '主要成分', dataIndex: 'mainIngredients' },
    { title: '剂型', dataIndex: 'dosageForm' },
    { title: '参考售价', dataIndex: 'price' },
    { title: '全网与电商热度', dataIndex: 'socialHeat' },
    { title: '用户评价', dataIndex: 'userReviews' },
    { title: '机会点分析', dataIndex: 'opportunity' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ShoppingOutlined style={{ color: '#fa8c16', fontSize: '20px' }} />
            <span>标杆竞品与全网声量数据库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/competitor"
            columns={exportColumns}
            filename="竞品数据库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
