'use client';

import React from 'react';
import { useTable } from '@refinedev/antd';
import { Table, Card, Tag, Space, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';

const { Text } = Typography;

export default function HealthLiteratureList() {
  const { tableProps } = useTable({
    resource: 'health-rd/literature',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: '文献编号',
      dataIndex: 'code',
      width: 100,
      render: (val: string) => <Tag color="default">{val}</Tag>,
    },
    {
      title: '文献标题',
      dataIndex: 'title',
      width: 220,
      ellipsis: true,
      render: (val: string) => <Text strong style={{ color: '#eb2f96' }}>{val}</Text>,
    },
    {
      title: '作者/期刊',
      dataIndex: 'journal',
      width: 160,
      ellipsis: true,
    },
    {
      title: '年份',
      dataIndex: 'year',
      width: 80,
      render: (val: number) => val || '-',
    },
    {
      title: '研究原料',
      dataIndex: 'material',
      width: 110,
      render: (val: string) => <Tag color="green">{val}</Tag>,
    },
    {
      title: '证据等级',
      dataIndex: 'evidenceLevel',
      width: 100,
      render: (val: string) => <Tag color="magenta">{val}</Tag>,
    },
    {
      title: 'AI 核心结论摘要',
      dataIndex: 'aiSummary',
      ellipsis: true,
    },
    {
      title: 'DOI/链接',
      dataIndex: 'doi',
      width: 150,
      ellipsis: true,
      render: (val: string) => (
        val ? <a href={val} target="_blank" rel="noreferrer">查看原文</a> : '-'
      ),
    },
  ];

  const exportColumns = [
    { title: '文献编号', dataIndex: 'code' },
    { title: '文献标题', dataIndex: 'title' },
    { title: '作者', dataIndex: 'authors' },
    { title: '期刊', dataIndex: 'journal' },
    { title: '发表年份', dataIndex: 'year' },
    { title: '研究原料', dataIndex: 'material' },
    { title: '研究方向', dataIndex: 'researchDir' },
    { title: '证据等级', dataIndex: 'evidenceLevel' },
    { title: '关键结论', dataIndex: 'keyConclusion' },
    { title: 'AI核心结论', dataIndex: 'aiSummary' },
    { title: 'DOI/链接', dataIndex: 'doi' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ color: '#eb2f96', fontSize: '20px' }} />
            <span>核心文献与临床证据数据库</span>
          </Space>
        }
        extra={
          <ExcelExportButton
            resource="health-rd/literature"
            columns={exportColumns}
            filename="核心文献证据库"
          />
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
