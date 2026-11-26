'use client';

import React, { useState } from 'react';
import { useTable, useForm } from '@refinedev/antd';
import { useDelete, useInvalidate } from '@refinedev/core';
import { Table, Card, Input, Button, Tag, Space, Modal, Descriptions, Typography, Form, Popconfirm, message } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { ExcelExportButton } from '../../../../components/excel/ExcelExportButton';
import { ExcelImportButton } from '../../../../components/excel/ExcelImportButton';
import { axiosInstance } from '../../../../lib/axios';

const { Title, Text } = Typography;

export default function HealthMaterialList() {
  const invalidate = useInvalidate();
  const { tableProps, searchFormProps } = useTable({
    resource: 'health-rd/material',
    syncWithLocation: true,
  });

  const { mutate: deleteOne } = useDelete();

  const refreshList = () => {
    invalidate({
      resource: 'health-rd/material',
      invalidates: ['list'],
    });
  };

  // 查看 Modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 新增/编辑 Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        // 修改更新
        await axiosInstance.put(`/health-rd/material/${editingRecord.id}`, values);
        message.success('原料数据更新成功！');
      } else {
        // 新增添加
        await axiosInstance.post('/health-rd/material', values);
        message.success('新增原料数据成功！');
      }
      setEditModalVisible(false);
      refreshList();
    } catch (err: any) {
      message.error(err.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    deleteOne(
      {
        resource: 'health-rd/material',
        id,
      },
      {
        onSuccess: () => {
          message.success('删除成功');
          refreshList();
        },
      },
    );
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      width: 90,
      render: (val: string) => <Tag color="default">{val}</Tag>,
    },
    {
      title: '原料名称',
      dataIndex: 'name',
      width: 120,
      render: (text: string) => <Text strong style={{ color: '#1677ff' }}>{text}</Text>,
    },
    {
      title: '拉丁学名',
      dataIndex: 'latinName',
      width: 160,
      render: (text: string) => <Text type="secondary" italic>{text || '-'}</Text>,
    },
    {
      title: '原料分类',
      dataIndex: 'category',
      width: 110,
      render: (text: string) => <Tag color="cyan">{text || '补益类'}</Tag>,
    },
    {
      title: '道地产区',
      dataIndex: 'originRegion',
      width: 120,
    },
    {
      title: '食药法规身份',
      dataIndex: 'foodStatus',
      width: 140,
      render: (text: string) => (
        <Tag color={text?.includes('食药') ? 'green' : 'orange'}>
          {text || '普通食品原料'}
        </Tag>
      ),
    },
    {
      title: '性味归经',
      dataIndex: 'flavorProperty',
      width: 140,
    },
    {
      title: '主要活性成分',
      dataIndex: 'activeComponents',
      ellipsis: true,
      render: (text: string) => <Text style={{ color: '#722ed1' }}>{text || '-'}</Text>,
    },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setDetailModalVisible(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该原料数据吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const exportColumns = [
    { title: '编号', dataIndex: 'code' },
    { title: '原料名称', dataIndex: 'name' },
    { title: '拉丁学名', dataIndex: 'latinName' },
    { title: '原料分类', dataIndex: 'category' },
    { title: '基原来源', dataIndex: 'source' },
    { title: '道地产区', dataIndex: 'originRegion' },
    { title: '药用/食用部位', dataIndex: 'medicinalParts' },
    { title: '性味归经', dataIndex: 'flavorProperty' },
    { title: '传统功效', dataIndex: 'traditionalEff' },
    { title: '现代药理研究', dataIndex: 'modernResearch' },
    { title: '主要活性成分', dataIndex: 'activeComponents' },
    { title: '安全用量', dataIndex: 'safetyDose' },
    { title: '法规身份', dataIndex: 'foodStatus' },
    { title: '法规限制', dataIndex: 'regulatoryLimit' },
    { title: '价格等级', dataIndex: 'priceGrade' },
  ];

  const importColumns = [
    { title: '编号', dataIndex: 'code' },
    { title: '原料名称', dataIndex: 'name' },
    { title: '拉丁学名', dataIndex: 'latinName' },
    { title: '原料分类', dataIndex: 'category' },
    { title: '基原来源', dataIndex: 'source' },
    { title: '道地产区', dataIndex: 'originRegion' },
    { title: '性味归经', dataIndex: 'flavorProperty' },
    { title: '传统功效', dataIndex: 'traditionalEff' },
    { title: '现代药理研究', dataIndex: 'modernResearch' },
    { title: '主要活性成分', dataIndex: 'activeComponents' },
    { title: '安全用量', dataIndex: 'safetyDose' },
    { title: '法规身份', dataIndex: 'foodStatus' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
            <span>药食同源战略原料数据库</span>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              添加原料
            </Button>
            <ExcelImportButton
              resource="health-rd/material"
              columns={importColumns}
              onSuccess={() => refreshList()}
              buttonText="导入 Excel"
            />
            <ExcelExportButton
              resource="health-rd/material"
              columns={exportColumns}
              filename="药食同源原料数据库"
            />
          </Space>
        }
        style={{ borderRadius: '12px' }}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </Card>

      {/* 查看详情 Modal */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#1677ff' }} />
            <span>原料全维详情卡片 - {selectedRecord?.name}</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2} style={{ marginTop: '16px' }}>
            <Descriptions.Item label="原料名称">{selectedRecord.name}</Descriptions.Item>
            <Descriptions.Item label="拉丁学名">{selectedRecord.latinName}</Descriptions.Item>
            <Descriptions.Item label="拼音">{selectedRecord.pinyin}</Descriptions.Item>
            <Descriptions.Item label="原料分类">{selectedRecord.category}</Descriptions.Item>
            <Descriptions.Item label="基原来源">{selectedRecord.source}</Descriptions.Item>
            <Descriptions.Item label="道地产区">{selectedRecord.originRegion}</Descriptions.Item>
            <Descriptions.Item label="性味归经">{selectedRecord.flavorProperty}</Descriptions.Item>
            <Descriptions.Item label="安全用量">{selectedRecord.safetyDose}</Descriptions.Item>
            <Descriptions.Item label="食药法规身份" span={2}>
              <Tag color="green">{selectedRecord.foodStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="传统功效" span={2}>
              {selectedRecord.traditionalEff}
            </Descriptions.Item>
            <Descriptions.Item label="现代药理研究" span={2}>
              {selectedRecord.modernResearch}
            </Descriptions.Item>
            <Descriptions.Item label="主要活性成分" span={2}>
              {selectedRecord.activeComponents}
            </Descriptions.Item>
            <Descriptions.Item label="法规限制与要求" span={2}>
              {selectedRecord.regulatoryLimit}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 新增 / 编辑数据 Modal */}
      <Modal
        title={editingRecord ? '编辑原料数据' : '新增原料数据'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={720}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ category: '补益类', foodStatus: '食药物质目录' }}
        >
          <Form.Item
            name="name"
            label="原料名称"
            rules={[{ required: true, message: '请输入原料名称' }]}
          >
            <Input placeholder="例如：黄芪、人参、灵芝" />
          </Form.Item>

          <Form.Item name="latinName" label="拉丁学名">
            <Input placeholder="例如：Astragalus membranaceus" />
          </Form.Item>

          <Form.Item name="code" label="编号">
            <Input placeholder="例如：HQ-01" />
          </Form.Item>

          <Form.Item name="category" label="原料分类">
            <Input placeholder="例如：补益类、清热类" />
          </Form.Item>

          <Form.Item name="originRegion" label="道地产区">
            <Input placeholder="例如：甘肃岷县、吉林长白山" />
          </Form.Item>

          <Form.Item name="foodStatus" label="食药法规身份">
            <Input placeholder="例如：食药物质目录 / 新食品原料" />
          </Form.Item>

          <Form.Item name="flavorProperty" label="性味归经">
            <Input placeholder="例如：甘，微温。归肺、脾经" />
          </Form.Item>

          <Form.Item name="activeComponents" label="主要活性成分">
            <Input.TextArea rows={2} placeholder="例如：黄芪甲苷、黄芪多糖" />
          </Form.Item>

          <Form.Item name="traditionalEff" label="传统功效">
            <Input.TextArea rows={2} placeholder="例如：补气升阳，固表止汗" />
          </Form.Item>

          <Form.Item name="modernResearch" label="现代药理研究">
            <Input.TextArea rows={2} placeholder="例如：增强免疫功能，抗衰老" />
          </Form.Item>

          <Form.Item name="regulatoryLimit" label="法规限制要求">
            <Input.TextArea rows={2} placeholder="例如：每日用量建议<=15g" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
