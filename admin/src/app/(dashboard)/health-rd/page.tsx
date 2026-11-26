'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Tag, Space, Table, Button, Spin } from 'antd';
import {
  DatabaseOutlined,
  CodeOutlined,
  ShopOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ControlOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { axiosInstance } from '../../../lib/axios';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function HealthRdDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/health-rd/dashboard/summary')
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="正在加载大健康研发知识平台中心数据..." />
      </div>
    );
  }

  const statCards = [
    { title: '药食同源原料', count: summary?.materialCount || 0, icon: <MedicineBoxOutlined />, color: '#1677ff', link: '/health-rd/material' },
    { title: '天然活性成分', count: summary?.ingredientCount || 0, icon: <ExperimentOutlined />, color: '#52c41a', link: '/health-rd/ingredient' },
    { title: '战略产品配方', count: summary?.formulaCount || 0, icon: <ShopOutlined />, color: '#faad14', link: '/health-rd/formula' },
    { title: '作用靶点/通路', count: summary?.targetCount || 0, icon: <SafetyCertificateOutlined />, color: '#722ed1', link: '/health-rd/target' },
    { title: '权威文献证据', count: summary?.literatureCount || 0, icon: <FileTextOutlined />, color: '#eb2f96', link: '/health-rd/literature' },
    { title: '核心食药法规', count: summary?.regulationCount || 0, icon: <ControlOutlined />, color: '#13c2c2', link: '/health-rd/regulation' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Banner */}
      <Card
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #092b00 0%, #135200 40%, #237804 100%)',
          color: '#fff',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(35, 120, 4, 0.25)',
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col span={16}>
            <Space align="center" style={{ marginBottom: '12px' }}>
              <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '12px' }}>
                V4.0 研发知识库完整版
              </Tag>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>已完美接入 PostgreSQL & 16 项中药知识矩阵</Text>
            </Space>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              🌿 中药/药食同源大健康研发知识平台
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', marginTop: '12px', fontSize: '15px', maxWidth: '800px' }}>
              基于传统中医药与现代食药物质法规（含国家卫健委《既是食品又是中药材物质目录》），整合活性成分、作用靶点、功效验证、工艺放大、质量标准与供应链合规体系。
            </Paragraph>
          </Col>
        </Row>
      </Card>

      {/* 核心指标卡片矩阵 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {statCards.map((item, idx) => (
          <Col xs={24} sm={12} md={8} lg={4} key={idx}>
            <Card
              hoverable
              style={{ borderRadius: '12px', border: '1px solid #e8e8e8' }}
              styles={{ body: { padding: '20px' } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '13px' }}>{item.title}</Text>
                  <Title level={3} style={{ margin: '8px 0 0 0', color: item.color }}>
                    {item.count}
                  </Title>
                </div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
              </div>
              <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                <Link href={item.link} style={{ fontSize: '13px', color: item.color, fontWeight: 500 }}>
                  查看数据库详情 <ArrowRightOutlined />
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 核心功能快捷面板 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="🍃 药食同源战略原料焦点" style={{ borderRadius: '12px' }}>
            <Table
              pagination={false}
              rowKey="id"
              dataSource={[
                { name: '黄芪', code: 'HQ-01', foodStatus: '食药物质目录', origin: '甘肃岷县', eff: '补气固表，利尿托毒' },
                { name: '人参 (5年及以下)', code: 'RS-02', foodStatus: '新食品原料公告', origin: '吉林长白山', eff: '大补元气，复脉固脱' },
                { name: '灵芝', code: 'LZ-03', foodStatus: '食药物质目录', origin: '安徽金寨', eff: '补气安神，止咳平喘' },
                { name: '天麻', code: 'TM-04', foodStatus: '食药物质目录', origin: '云南昭通', eff: '息风止痉，平抑肝阳' },
                { name: '当归', code: 'DG-05', foodStatus: '食药物质目录', origin: '甘肃岷县', eff: '补血活血，调经止痛' },
              ]}
              columns={[
                { title: '原料名称', dataIndex: 'name', render: (val) => <a>{val}</a> },
                { title: '编号', dataIndex: 'code' },
                { title: '法规身份', dataIndex: 'foodStatus', render: (val) => <Tag color="blue">{val}</Tag> },
                { title: '道地产区', dataIndex: 'origin' },
                { title: '传统功效', dataIndex: 'eff', ellipsis: true },
              ]}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="🎯 作用靶点与核心文献协同" style={{ borderRadius: '12px' }}>
            <Table
              pagination={false}
              rowKey="id"
              dataSource={[
                { ingredient: '黄芪甲苷', target: 'TLR4', pathway: 'TLR4/NF-kB', domain: '免疫调节', level: 'B+' },
                { ingredient: '黄芪多糖', target: '巨噬细胞', pathway: 'TLR4/MyD88', domain: '免疫调节', level: 'B+' },
                { ingredient: '人参皂苷Rg1', target: 'HPA轴', pathway: 'CRH-ACTH-Cortisol', domain: '认知健康/抗疲劳', level: 'A-' },
                { ingredient: '灵芝多糖', target: 'NK细胞', pathway: 'JAK-STAT', domain: '免疫调节', level: 'A' },
                { ingredient: '天麻素', target: 'GABAa受体', pathway: 'GABA能神经通路', domain: '神经保护/助眠', level: 'A+' },
              ]}
              columns={[
                { title: '活性成分', dataIndex: 'ingredient', render: (val) => <Text strong>{val}</Text> },
                { title: '作用靶点', dataIndex: 'target', render: (val) => <Tag color="purple">{val}</Tag> },
                { title: '信号通路', dataIndex: 'pathway' },
                { title: '疾病/功能领域', dataIndex: 'domain', render: (val) => <Tag color="green">{val}</Tag> },
                { title: '证据等级', dataIndex: 'level', render: (val) => <Tag color="magenta">{val}</Tag> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
