'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Modal, Form, InputNumber, Tag, Switch, Avatar, Button, Select, message } from 'antd';
import { useTable } from '@refinedev/antd';
import { UserOutlined, WalletOutlined, StarOutlined, TrophyOutlined, TagsOutlined, CalendarOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

interface MemberRecord {
  id: number;
  nickname: string;
  avatar?: string;
  mobile: string;
  status: 'ENABLE' | 'DISABLE';
  points: number;
  balance: number;
  experience: number;
  levelId?: number;
  level?: {
    id: number;
    name: string;
    level: number;
  } | null;
  tagIds?: number[] | null;
}

export default function MemberList() {
  const { tableProps, tableQuery: tableQueryResult } = useTable<MemberRecord>({
    resource: 'member/user',
    syncWithLocation: true,
  });

  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);
  
  const [pointsForm] = Form.useForm();
  const [balanceForm] = Form.useForm();
  const [expForm] = Form.useForm();
  const [tagsForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Tags reference list
  const [tagList, setTagList] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance.get('/member/tag')
      .then(res => setTagList(res.data || []))
      .catch(err => console.error('Failed to load tags', err));
  }, []);

  const handleStatusChange = async (record: MemberRecord, checked: boolean) => {
    const newStatus = checked ? 'ENABLE' : 'DISABLE';
    try {
      await axiosInstance.put(`/member/user/${record.id}/status`, { status: newStatus });
      message.success('会员状态更新成功');
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '更新会员状态失败');
    }
  };

  const openPointsModal = (record: MemberRecord) => {
    setSelectedMember(record);
    pointsForm.resetFields();
    setPointsModalOpen(true);
  };

  const openBalanceModal = (record: MemberRecord) => {
    setSelectedMember(record);
    balanceForm.resetFields();
    setBalanceModalOpen(true);
  };

  const openExpModal = (record: MemberRecord) => {
    setSelectedMember(record);
    expForm.resetFields();
    setExpModalOpen(true);
  };

  const openTagsModal = (record: MemberRecord) => {
    setSelectedMember(record);
    tagsForm.setFieldsValue({
      tagIds: record.tagIds || []
    });
    setTagsModalOpen(true);
  };

  const handleAdjustPoints = async (values: any) => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/member/user/${selectedMember.id}/adjust-points`, {
        amount: values.amount,
      });
      message.success('会员积分调整成功');
      setPointsModalOpen(false);
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '调整积分失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustBalance = async (values: any) => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      const amountCents = Math.round(values.amount * 100);
      await axiosInstance.put(`/member/user/${selectedMember.id}/adjust-balance`, {
        amount: amountCents,
      });
      message.success('会员余额调整成功');
      setBalanceModalOpen(false);
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '调整余额失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustExp = async (values: any) => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/member/user/${selectedMember.id}/adjust-experience`, {
        amount: values.amount,
      });
      message.success('会员成长值调整成功');
      setExpModalOpen(false);
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '调整成长值失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTags = async (values: any) => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/member/user/${selectedMember.id}/assign-tags`, {
        tagIds: values.tagIds,
      });
      message.success('分配会员标签成功');
      setTagsModalOpen(false);
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '分配标签失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMockSignIn = async (record: MemberRecord) => {
    try {
      const res = await axiosInstance.post(`/member/user/${record.id}/sign-in`);
      const { pointsRewarded, consecutiveDays } = res.data;
      Modal.success({
        title: '模拟签到成功',
        content: (
          <div>
            <p>会员 <strong>{record.nickname}</strong> 成功签到！</p>
            <p>此次获得积分奖励：<span style={{ color: '#d46b08', fontWeight: 'bold' }}>+{pointsRewarded}</span> 分</p>
            <p>已连续签到：<span style={{ color: '#1890ff', fontWeight: 'bold' }}>{consecutiveDays}</span> 天</p>
          </div>
        )
      });
      tableQueryResult.refetch();
    } catch (err: any) {
      message.error(err.response?.data?.message || '模拟签到失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="会员列表">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column 
            dataIndex="nickname" 
            title="会员昵称" 
            render={(nickname: string, record: MemberRecord) => (
              <Space>
                <Avatar src={record.avatar} icon={<UserOutlined />} />
                <div>
                  <div style={{ fontWeight: '500' }}>{nickname}</div>
                  {record.level ? (
                    <Tag color="purple" icon={<TrophyOutlined />} style={{ marginTop: '4px' }}>
                      {record.level.name} (Lvl {record.level.level})
                    </Tag>
                  ) : (
                    <Tag style={{ marginTop: '4px' }}>普通会员</Tag>
                  )}
                </div>
              </Space>
            )}
          />
          <Table.Column dataIndex="mobile" title="手机号码" width={130} />
          <Table.Column 
            dataIndex="balance" 
            title="账户余额" 
            width={120}
            render={(val: number) => (
              <span style={{ color: '#cf1322', fontWeight: '600' }}>
                ¥{(val / 100).toFixed(2)}
              </span>
            )}
          />
          <Table.Column 
            dataIndex="points" 
            title="积分" 
            width={100}
            render={(val: number) => (
              <span style={{ color: '#d46b08', fontWeight: '600' }}>
                {val}
              </span>
            )}
          />
          <Table.Column 
            dataIndex="experience" 
            title="成长值" 
            width={100}
            render={(val: number) => (
              <span style={{ color: '#722ed1', fontWeight: '600' }}>
                {val}
              </span>
            )}
          />
          <Table.Column 
            title="标签" 
            render={(_, record: MemberRecord) => {
              const ids = record.tagIds || [];
              if (ids.length === 0) return <span style={{ color: '#ccc' }}>-</span>;
              return (
                <Space wrap size={4}>
                  {ids.map(tagId => {
                    const tag = tagList.find(t => t.id === tagId);
                    return tag ? (
                      <Tag color="blue" key={tagId}>{tag.name}</Tag>
                    ) : (
                      <Tag key={tagId}>TagID: {tagId}</Tag>
                    );
                  })}
                </Space>
              );
            }}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={100}
            render={(status: string, record: MemberRecord) => (
              <Switch 
                checked={status === 'ENABLE'} 
                onChange={(checked) => handleStatusChange(record, checked)} 
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            )}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={280}
            render={(_, record: MemberRecord) => (
              <Space wrap>
                <Button 
                  size="small" 
                  icon={<WalletOutlined />} 
                  onClick={() => openBalanceModal(record)}
                >
                  余额
                </Button>
                <Button 
                  size="small" 
                  icon={<StarOutlined />} 
                  onClick={() => openPointsModal(record)}
                >
                  积分
                </Button>
                <Button 
                  size="small" 
                  icon={<TrophyOutlined />} 
                  onClick={() => openExpModal(record)}
                >
                  成长值
                </Button>
                <Button 
                  size="small" 
                  icon={<TagsOutlined />} 
                  onClick={() => openTagsModal(record)}
                >
                  标签
                </Button>
                <Button 
                  size="small" 
                  type="primary" 
                  ghost
                  icon={<CalendarOutlined />} 
                  onClick={() => handleMockSignIn(record)}
                  disabled={record.status !== 'ENABLE'}
                >
                  签到
                </Button>
              </Space>
            )}
          />
        </Table>
      </List>

      {/* MODAL 1: Adjust Points */}
      <Modal
        title={selectedMember ? `调整积分 - ${selectedMember.nickname}` : '调整积分'}
        open={pointsModalOpen}
        onCancel={() => setPointsModalOpen(false)}
        onOk={() => pointsForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={pointsForm} layout="vertical" onFinish={handleAdjustPoints}>
          <Form.Item
            name="amount"
            label="调整额度 (输入正数增加，负数减少)"
            rules={[{ required: true, message: '请输入调整额度' }]}
          >
            <InputNumber precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 2: Adjust Balance */}
      <Modal
        title={selectedMember ? `调整余额 - ${selectedMember.nickname}` : '调整余额'}
        open={balanceModalOpen}
        onCancel={() => setBalanceModalOpen(false)}
        onOk={() => balanceForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={balanceForm} layout="vertical" onFinish={handleAdjustBalance}>
          <Form.Item
            name="amount"
            label="调整金额 (元，输入正数充值，负数扣减)"
            rules={[{ required: true, message: '请输入调整金额' }]}
          >
            <InputNumber precision={2} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 3: Adjust Experience (Growth Value) */}
      <Modal
        title={selectedMember ? `调整成长值 - ${selectedMember.nickname}` : '调整成长值'}
        open={expModalOpen}
        onCancel={() => setExpModalOpen(false)}
        onOk={() => expForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={expForm} layout="vertical" onFinish={handleAdjustExp}>
          <Form.Item
            name="amount"
            label="调整数值 (输入正数增加，负数扣除，将自动计算对应等级)"
            rules={[{ required: true, message: '请输入调整数值' }]}
          >
            <InputNumber precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 4: Assign Tags */}
      <Modal
        title={selectedMember ? `分配标签 - ${selectedMember.nickname}` : '分配标签'}
        open={tagsModalOpen}
        onCancel={() => setTagsModalOpen(false)}
        onOk={() => tagsForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={tagsForm} layout="vertical" onFinish={handleAssignTags}>
          <Form.Item
            name="tagIds"
            label="选择标签"
          >
            <Select
              mode="multiple"
              placeholder="请选择标签"
              style={{ width: '100%' }}
              options={tagList.map(t => ({ label: t.name, value: t.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
