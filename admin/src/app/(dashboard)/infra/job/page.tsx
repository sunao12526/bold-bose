'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, Select, Tag, Switch, Button, message } from 'antd';
import { useTable, useForm } from '@refinedev/antd';
import { PlayCircleOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function JobList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable({
    resource: 'infra/job',
    syncWithLocation: true,
  });

  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // Job logs tracker
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [jobLogs, setJobLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    form.setFieldsValue({ status: 'ENABLE', cronExpression: '0 0 2 * * *' });
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    form.resetFields();
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const { form, onFinish, formLoading } = useForm<any, any, any>({
    resource: 'infra/job',
    action: formMode,    onMutationSuccess: () => {
      setIsModalOpen(false);
      tableQueryResult.refetch();
    },
  });

  const handleToggleStatus = async (record: any, checked: boolean) => {
    try {
      await axiosInstance.put(`/infra/job/${record.id}`, {
        status: checked ? 'ENABLE' : 'DISABLE',
      });
      message.success(`任务 [${record.name}] 已${checked ? '开启' : '关闭'}`);
      tableQueryResult.refetch();
    } catch (err) {
      console.error(err);
      message.error('切换任务状态失败');
    }
  };

  const handleRunOnce = async (record: any) => {
    try {
      await axiosInstance.post(`/infra/job/${record.id}/run`);
      message.success(`已手动触发执行一次 [${record.name}]，结果请稍后在调度日志中查看`);
    } catch (err) {
      console.error(err);
      message.error('手动执行任务失败');
    }
  };

  const handleOpenLogs = async () => {
    setIsLogModalOpen(true);
    setLogsLoading(true);
    try {
      const res = await axiosInstance.get('/infra/job-log');
      setJobLogs(res.data);
    } catch (err) {
      message.error('加载任务调度日志失败');
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: (
            <Space>
              <Button 
                icon={<HistoryOutlined />} 
                onClick={handleOpenLogs}
              >
                调度日志
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreate}
              >
                新增任务
              </Button>
            </Space>
          ),
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column dataIndex="name" title="任务名称" />
          <Table.Column 
            dataIndex="handlerName" 
            title="处理器 (Handler)" 
            render={(val) => <code style={{ fontSize: '12px' }}>{val}</code>}
          />
          <Table.Column 
            dataIndex="cronExpression" 
            title="Cron表达式" 
            render={(val) => <code style={{ fontSize: '12px', color: '#1677ff' }}>{val}</code>}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={120}
            render={(status: string, record: any) => (
              <Switch 
                checkedChildren="运行中" 
                unCheckedChildren="暂停" 
                checked={status === 'ENABLE'} 
                onChange={(checked) => handleToggleStatus(record, checked)}
              />
            )}
          />
          <Table.Column dataIndex="remark" title="备注" ellipsis />
          <Table.Column
            title="操作"
            render={(_, record: any) => (
              <Space>
                <Button 
                  type="link" 
                  icon={<PlayCircleOutlined />} 
                  size="small" 
                  onClick={() => handleRunOnce(record)}
                  title="执行一次"
                >
                  执行一次
                </Button>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} onSuccess={() => tableQueryResult.refetch()} />
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Create / Edit Job Modal */}
      <Modal forceRender
        title={formMode === 'create' ? '新增定时任务' : '编辑定时任务'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onFinish(values)}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Form.Item
            name="name"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="例如：日志清理定时任务" />
          </Form.Item>

          <Form.Item
            name="handlerName"
            label="处理器名称 (Job Handler)"
            rules={[{ required: true, message: '请选择处理器' }]}
          >
            <Select placeholder="请选择要执行的方法">
              <Select.Option value="logCleanupJob">审计日志清理 logCleanupJob</Select.Option>
              <Select.Option value="demoTaskJob">测试演示任务 demoTaskJob</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cronExpression"
            label="Cron 表达式"
            rules={[{ required: true, message: '请输入 Cron 表达式' }]}
            extra="支持标准的 5 或 6 位 Cron 表达式。例如：0 0 2 * * * (每日凌晨2点), */5 * * * * * (每5秒执行一次)"
          >
            <Input placeholder="例如: 0 0 2 * * *" />
          </Form.Item>

          <Form.Item name="status" label="初始状态" initialValue="ENABLE">
            <Select>
              <Select.Option value="ENABLE">开启</Select.Option>
              <Select.Option value="DISABLE">暂停</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="任务相关的补充描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Job Execution Logs Tracking Modal */}
      <Modal
        title="任务调度日志 (最近 200 条)"
        open={isLogModalOpen}
        onCancel={() => setIsLogModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsLogModalOpen(false)}>
            关闭
          </Button>
        ]}
        width={900}
      >
        <Table 
          dataSource={jobLogs} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          loading={logsLoading}
          size="small"
        >
          <Table.Column dataIndex="id" title="日志ID" width={80} />
          <Table.Column 
            dataIndex="jobId" 
            title="任务ID" 
            width={80} 
            render={(id) => `#${id}`}
          />
          <Table.Column 
            dataIndex="handlerName" 
            title="处理器" 
            render={(val) => <code>{val}</code>}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={100}
            render={(status: number) => (
              <Tag color={status === 200 ? 'green' : 'red'}>
                {status === 200 ? '成功' : '失败'}
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="duration" 
            title="耗时" 
            width={100}
            render={(dur: number) => `${dur} ms`}
          />
          <Table.Column 
            dataIndex="errorMessage" 
            title="异常信息" 
            ellipsis 
            render={(msg: string) => msg ? <span style={{ color: '#f5222d', fontSize: '12px' }}>{msg}</span> : '-'}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="执行时间" 
            width={180}
            render={(date: string) => new Date(date).toLocaleString()}
          />
        </Table>
      </Modal>
    </div>
  );
}
