'use client';

export const dynamic = "force-dynamic";

import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Button, Modal, Form, Input, Select, Tag, Popconfirm, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function CmsCommentList() {
  const { tableProps, tableQuery } = useTable({
    resource: 'cms/comment',
    syncWithLocation: true,
  });

  const handleApprove = async (id: number) => {
    try {
      await axiosInstance.put(`/cms/comment/${id}/approve`);
      message.success('审核通过');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '操作失败');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axiosInstance.put(`/cms/comment/${id}/reject`);
      message.success('已拒绝');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/cms/comment/${id}`);
      message.success('删除成功');
      tableQuery.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '删除失败');
    }
  };

  const statusMap: Record<string, { color: string; text: string }> = {
    PENDING: { color: 'orange', text: '待审核' },
    APPROVED: { color: 'green', text: '已通过' },
    REJECTED: { color: 'red', text: '已拒绝' },
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="评论管理">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={80} />
          <Table.Column
            dataIndex={['article', 'title']}
            title="所属文章"
            ellipsis
          />
          <Table.Column dataIndex="nickname" title="评论者" width={120} />
          <Table.Column dataIndex="content" title="评论内容" ellipsis />
          <Table.Column
            dataIndex="status"
            title="状态"
            width={100}
            render={(status: string) => {
              const s = statusMap[status] || { color: 'default', text: status };
              return <Tag color={s.color}>{s.text}</Tag>;
            }}
          />
          <Table.Column
            dataIndex="createdAt"
            title="评论时间"
            width={170}
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            title="操作"
            width={220}
            render={(_, record: any) => (
              <Space>
                {record.status === 'PENDING' && (
                  <>
                    <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>
                      通过
                    </Button>
                    <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>
                      拒绝
                    </Button>
                  </>
                )}
                <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </List>
    </div>
  );
}
