'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List, DeleteButton } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, Select, Tag, Drawer, Tabs, Checkbox, Row, Col, Card, message, Divider } from 'antd';
import { useTable, useSelect } from '@refinedev/antd';
import { ImportOutlined, EditOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function CodegenList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'infra/codegen',
    syncWithLocation: true,
  });

  // --- Modal States ---
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [selectedDbTables, setSelectedDbTables] = useState<string[]>([]);
  const [importLoading, setImportLoading] = useState(false);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [currentTableId, setCurrentTableId] = useState<number | null>(null);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [writingLoading, setWritingLoading] = useState(false);

  // Load Dictionary Types for column configs
  const { selectProps: dictTypeSelectProps } = useSelect({
    resource: 'system/dict-type',
    optionLabel: 'name',
    optionValue: 'type',
  });

  // 1. Fetch DB Tables for Import
  const handleOpenImport = async () => {
    setIsImportModalOpen(true);
    setImportLoading(true);
    try {
      const res = await axiosInstance.get('/infra/codegen/db-tables');
      setDbTables(res.data);
    } catch (err) {
      message.error('加载数据库表失败');
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportSubmit = async () => {
    if (selectedDbTables.length === 0) {
      message.warning('请选择要导入的数据库表');
      return;
    }
    setImportLoading(true);
    try {
      await axiosInstance.post('/infra/codegen/import', {
        tableNames: selectedDbTables,
        author: 'Antigravity',
      });
      message.success('表结构导入成功');
      setIsImportModalOpen(false);
      setSelectedDbTables([]);
      tableQueryResult.refetch();
    } catch (err) {
      message.error('导入表结构失败');
    } finally {
      setImportLoading(false);
    }
  };

  // 2. Open Config Edit Drawer
  const handleOpenEdit = async (id: number) => {
    setCurrentTableId(id);
    setIsEditDrawerOpen(true);
    setEditLoading(true);
    try {
      const res = await axiosInstance.get(`/infra/codegen/${id}`);
      setEditingTable(res.data);
      editForm.resetFields();
      editForm.setFieldsValue({
        id: res.data.id,
        tableName: res.data.tableName,
        tableComment: res.data.tableComment,
        className: res.data.className,
        moduleName: res.data.moduleName,
        businessName: res.data.businessName,
        classComment: res.data.classComment,
        author: res.data.author,
      });
    } catch (err) {
      message.error('加载生成配置失败');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!currentTableId || !editingTable) return;
    setEditLoading(true);
    try {
      // Merge form values with existing column modifications
      const updatedColumns = editingTable.columns.map((col: any) => {
        const rowVal = values[`col_${col.id}`];
        if (rowVal) {
          return {
            ...col,
            columnComment: rowVal.columnComment,
            crud: !!rowVal.crud,
            listOperation: !!rowVal.listOperation,
            formOperation: !!rowVal.formOperation,
            htmlType: rowVal.htmlType,
            dictType: rowVal.dictType || null,
          };
        }
        return col;
      });

      const payload = {
        ...values,
        columns: updatedColumns,
      };

      await axiosInstance.put(`/infra/codegen/${currentTableId}`, payload);
      message.success('生成配置更新成功');
      setIsEditDrawerOpen(false);
      tableQueryResult.refetch();
    } catch (err) {
      message.error('更新生成配置失败');
    } finally {
      setEditLoading(false);
    }
  };

  // 3. Open Preview & Generator Modal
  const handleOpenPreview = async (id: number) => {
    setCurrentTableId(id);
    setIsPreviewModalOpen(true);
    setPreviewLoading(true);
    try {
      const res = await axiosInstance.get(`/infra/codegen/preview/${id}`);
      setPreviewFiles(res.data);
    } catch (err) {
      message.error('加载代码预览失败');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleWriteCode = async () => {
    if (!currentTableId) return;
    setWritingLoading(true);
    try {
      const res = await axiosInstance.post(`/infra/codegen/write/${currentTableId}`);
      if (res.data.success) {
        Modal.success({
          title: '代码写入成功',
          content: (
            <div>
              <p>代码文件已成功同步写入项目路径下：</p>
              <ul>
                {res.data.files.map((file: string) => (
                  <li key={file}><code>{file}</code></li>
                ))}
              </ul>
              {res.data.parentRegistered ? (
                <Tag color="green">已自动注册父模块关联导入</Tag>
              ) : (
                <Tag color="warning">请手动在对应的父模块注册导入模块</Tag>
              )}
            </div>
          ),
        });
        setIsPreviewModalOpen(false);
      }
    } catch (err) {
      message.error('写入代码到本地文件失败');
    } finally {
      setWritingLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: (
            <Button
              type="primary"
              icon={<ImportOutlined />}
              onClick={handleOpenImport}
            >
              导入数据表
            </Button>
          ),
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column dataIndex="tableName" title="表名称" />
          <Table.Column dataIndex="tableComment" title="表描述" ellipsis />
          <Table.Column dataIndex="className" title="实体类" />
          <Table.Column
            dataIndex="moduleName"
            title="模块名"
            render={(name) => <Tag color="blue">{name}</Tag>}
          />
          <Table.Column dataIndex="businessName" title="业务名" />
          <Table.Column dataIndex="author" title="作者" />
          <Table.Column
            dataIndex="createdAt"
            title="导入时间"
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            title="操作"
            render={(_, record: any) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => handleOpenEdit(record.id)}
                >
                  配置
                </Button>
                <Button
                  type="primary"
                  ghost
                  icon={<CodeOutlined />}
                  size="small"
                  onClick={() => handleOpenPreview(record.id)}
                >
                  生成
                </Button>
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>

      {/* 1. Import raw tables modal */}
      <Modal
        title="导入数据表"
        open={isImportModalOpen}
        onCancel={() => setIsImportModalOpen(false)}
        onOk={handleImportSubmit}
        confirmLoading={importLoading}
        width={700}
      >
        <Table
          dataSource={dbTables}
          rowKey="tableName"
          pagination={false}
          loading={importLoading}
          rowSelection={{
            selectedRowKeys: selectedDbTables,
            onChange: (keys) => setSelectedDbTables(keys as string[]),
          }}
        >
          <Table.Column dataIndex="tableName" title="表名称" />
          <Table.Column dataIndex="tableComment" title="表描述" />
        </Table>
      </Modal>

      {/* 2. Configure Edit Drawer */}
      <Drawer
        title={`生成器配置 - ${editingTable?.tableName || ''}`}
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        width={1100}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsEditDrawerOpen(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={() => editForm.submit()} loading={editLoading}>
              保存配置
            </Button>
          </div>
        }
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Tabs defaultActiveKey="base">
            <Tabs.TabPane tab="基本信息" key="base">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="tableName" label="表名称"><Input disabled /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="tableComment" label="表描述" rules={[{ required: true }]}><Input /></Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="className" label="实体类名称" rules={[{ required: true }]}><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="classComment" label="类注释描述" rules={[{ required: true }]}><Input /></Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="moduleName" label="系统模块 (系统名)" rules={[{ required: true }]}><Input placeholder="例如: system" /></Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="businessName" label="业务模块 (表主名)" rules={[{ required: true }]}><Input placeholder="例如: post" /></Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="author" label="开发作者" rules={[{ required: true }]}><Input /></Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>

            <Tabs.TabPane tab="字段属性配置" key="fields">
              <Table
                dataSource={editingTable?.columns || []}
                rowKey="id"
                pagination={false}
                scroll={{ y: 500 }}
              >
                <Table.Column
                  dataIndex="columnName"
                  title="字段名"
                  width={150}
                  render={(name, record: any) => (
                    <div>
                      <strong>{name}</strong>
                      <div style={{ fontSize: '11px', color: '#999' }}>{record.dataType}</div>
                    </div>
                  )}
                />
                <Table.Column
                  title="字段描述"
                  width={180}
                  render={(_, record: any) => (
                    <Form.Item
                      name={['col_' + record.id, 'columnComment']}
                      initialValue={record.columnComment}
                      style={{ margin: 0 }}
                    >
                      <Input size="small" />
                    </Form.Item>
                  )}
                />
                <Table.Column
                  title="TS/Prisma类型"
                  width={140}
                  render={(_, record: any) => (
                    <span style={{ fontSize: '12px' }}>
                      <code>{record.tsType}</code> / <code>{record.prismaType}</code>
                    </span>
                  )}
                />
                <Table.Column
                  title="CRUD"
                  width={80}
                  render={(_, record: any) => (
                    <Form.Item
                      name={['col_' + record.id, 'crud']}
                      valuePropName="checked"
                      initialValue={record.crud}
                      style={{ margin: 0 }}
                    >
                      <Checkbox disabled={record.primaryKey} />
                    </Form.Item>
                  )}
                />
                <Table.Column
                  title="列表显示"
                  width={90}
                  render={(_, record: any) => (
                    <Form.Item
                      name={['col_' + record.id, 'listOperation']}
                      valuePropName="checked"
                      initialValue={record.listOperation}
                      style={{ margin: 0 }}
                    >
                      <Checkbox />
                    </Form.Item>
                  )}
                />
                <Table.Column
                  title="表单展示"
                  width={90}
                  render={(_, record: any) => (
                    <Form.Item
                      name={['col_' + record.id, 'formOperation']}
                      valuePropName="checked"
                      initialValue={record.formOperation}
                      style={{ margin: 0 }}
                    >
                      <Checkbox disabled={record.primaryKey} />
                    </Form.Item>
                  )}
                />
                <Table.Column
                  title="展示组件"
                  width={150}
                  render={(_, record: any) => (
                    <Form.Item
                      name={['col_' + record.id, 'htmlType']}
                      initialValue={record.htmlType}
                      style={{ margin: 0 }}
                    >
                      <Select size="small" style={{ width: '100%' }}>
                        <Select.Option value="input">单行文本 Input</Select.Option>
                        <Select.Option value="textarea">多行文本 TextArea</Select.Option>
                        <Select.Option value="number">数字框 Number</Select.Option>
                        <Select.Option value="select">下拉选择 Select</Select.Option>
                        <Select.Option value="switch">开关 Switch</Select.Option>
                        <Select.Option value="date">日期 Date</Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                />
                <Table.Column
                  title="绑定数据字典"
                  width={180}
                  render={(_, record: any) => (
                    <Form.Item
                      name={['col_' + record.id, 'dictType']}
                      initialValue={record.dictType || ''}
                      style={{ margin: 0 }}
                    >
                      <Select size="small" style={{ width: '100%' }} {...dictTypeSelectProps} allowClear placeholder="绑定字典">
                        <Select.Option value="">-无-</Select.Option>
                      </Select>
                    </Form.Item>
                  )}
                />
              </Table>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Drawer>

      {/* 3. Preview & Generate Modal */}
      <Modal
        title="预览生成代码"
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPreviewModalOpen(false)}>
            取消
          </Button>,
          <Button
            key="generate"
            type="primary"
            icon={<CodeOutlined />}
            onClick={handleWriteCode}
            loading={writingLoading}
          >
            写入代码到项目
          </Button>
        ]}
        width={950}
      >
        {previewLoading ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>正在生成代码中...</div>
        ) : (
          <Tabs defaultActiveKey="0">
            {previewFiles.map((file, idx) => (
              <Tabs.TabPane tab={file.name} key={idx.toString()}>
                <div style={{ marginBottom: '8px' }}>
                  <Tag color="geekblue">文件写入路径: <code>{file.path}</code></Tag>
                </div>
                <pre style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '16px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '500px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  lineHeight: '1.5'
                }}>
                  <code>{file.content}</code>
                </pre>
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </Modal>
    </div>
  );
}
