'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Tag, Switch, Avatar, Button, Select, message, Drawer, Tabs, Card, Descriptions, Row, Col, Statistic } from 'antd';
import { useTable } from '@refinedev/antd';
import { UserOutlined, WalletOutlined, StarOutlined, TrophyOutlined, TagsOutlined, CalendarOutlined, SearchOutlined, ReloadOutlined, ApartmentOutlined, ShoppingCartOutlined, FileTextOutlined, EnvironmentOutlined, GiftOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';
import dayjs from 'dayjs';

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
  groupId?: number;
  group?: {
    id: number;
    name: string;
  } | null;
  tagIds?: number[] | null;
  createdAt: string;
}

export default function MemberList() {
  const { tableProps, tableQuery: tableQueryResult, searchFormProps } = useTable<MemberRecord>({
    resource: 'member/user',
    onSearch: (params: any) => {
      return [
        { field: 'nickname', operator: 'contains', value: params.nickname },
        { field: 'mobile', operator: 'contains', value: params.mobile },
        { field: 'status', operator: 'eq', value: params.status },
        { field: 'levelId', operator: 'eq', value: params.levelId },
        { field: 'groupId', operator: 'eq', value: params.groupId },
      ];
    },
    syncWithLocation: true,
  });

  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);

  // Detail Drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [detailMember, setDetailMember] = useState<MemberRecord | null>(null);
  const [detailTabKey, setDetailTabKey] = useState('balance');
  const [balanceRecords, setBalanceRecords] = useState<any[]>([]);
  const [pointRecords, setPointRecords] = useState<any[]>([]);
  const [signInRecords, setSignInRecords] = useState<any[]>([]);
  const [orderRecords, setOrderRecords] = useState<any[]>([]);
  const [addressRecords, setAddressRecords] = useState<any[]>([]);
  const [couponRecords, setCouponRecords] = useState<any[]>([]);
  const [expRecords, setExpRecords] = useState<any[]>([]);
  const [refundRecords, setRefundRecords] = useState<any[]>([]);
  const [levelRecords, setLevelRecords] = useState<any[]>([]);
  const [loadingDrawerData, setLoadingDrawerData] = useState(false);

  const [pointsForm] = Form.useForm();
  const [balanceForm] = Form.useForm();
  const [expForm] = Form.useForm();
  const [tagsForm] = Form.useForm();
  const [levelForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Reference lists
  const [tagList, setTagList] = useState<any[]>([]);
  const [levelList, setLevelList] = useState<any[]>([]);
  const [groupList, setGroupList] = useState<any[]>([]);

  useEffect(() => {
    // Load Tags
    axiosInstance.get('/member/tag')
      .then(res => setTagList(res.data?.items || res.data || []))
      .catch(err => console.error('Failed to load tags', err));

    // Load Levels
    axiosInstance.get('/member/level')
      .then(res => setLevelList(res.data?.items || res.data || []))
      .catch(err => console.error('Failed to load levels', err));

    // Load Groups
    axiosInstance.get('/member/group')
      .then(res => setGroupList(res.data?.items || res.data || []))
      .catch(err => console.error('Failed to load groups', err));
  }, []);

  // Fetch Drawer Tab Data
  const fetchDrawerData = async (memberId: number, tab: string) => {
    setLoadingDrawerData(true);
    try {
      if (tab === 'balance') {
        const res = await axiosInstance.get(`/member/balance-record?memberId=${memberId}`);
        setBalanceRecords(res.data?.items || res.data || []);
      } else if (tab === 'point') {
        const res = await axiosInstance.get(`/member/point-record?memberId=${memberId}`);
        setPointRecords(res.data?.items || res.data || []);
      } else if (tab === 'signin') {
        const res = await axiosInstance.get(`/member/sign-in-record?memberId=${memberId}`);
        setSignInRecords(res.data?.items || res.data || []);
      } else if (tab === 'order') {
        const res = await axiosInstance.get(`/mall/order?memberId=${memberId}`);
        setOrderRecords(res.data?.items || res.data || []);
      } else if (tab === 'address') {
        const res = await axiosInstance.get(`/member/address?memberId=${memberId}`);
        setAddressRecords(res.data?.items || res.data || []);
      } else if (tab === 'coupon') {
        const res = await axiosInstance.get(`/mall/coupon/user-list?memberId=${memberId}`);
        setCouponRecords(res.data?.items || res.data || []);
      } else if (tab === 'experience') {
        const res = await axiosInstance.get(`/member/experience-record?memberId=${memberId}`);
        setExpRecords(res.data?.items || res.data || []);
      } else if (tab === 'refund') {
        const res = await axiosInstance.get(`/mall/refund?memberId=${memberId}`);
        setRefundRecords(res.data?.items || res.data || []);
      } else if (tab === 'level_history') {
        const res = await axiosInstance.get(`/member/level-record?memberId=${memberId}`);
        setLevelRecords(res.data?.items || res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch detail logs', err);
    } finally {
      setLoadingDrawerData(false);
    }
  };

  useEffect(() => {
    if (detailDrawerOpen && detailMember) {
      fetchDrawerData(detailMember.id, detailTabKey);
    }
  }, [detailDrawerOpen, detailMember, detailTabKey]);

  const handleStatusChange = async (record: MemberRecord, checked: boolean) => {
    const newStatus = checked ? 'ENABLE' : 'DISABLE';
    try {
      await axiosInstance.put(`/member/user/${record.id}/status`, { status: newStatus });
      message.success('会员状态更新成功');
      tableQueryResult.refetch();
      if (detailMember && detailMember.id === record.id) {
        setDetailMember(prev => prev ? { ...prev, status: newStatus } : null);
      }
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

  const openLevelModal = (record: MemberRecord) => {
    setSelectedMember(record);
    levelForm.setFieldsValue({
      levelId: record.levelId || undefined
    });
    setLevelModalOpen(true);
  };

  const openGroupModal = (record: MemberRecord) => {
    setSelectedMember(record);
    groupForm.setFieldsValue({
      groupId: record.groupId || undefined
    });
    setGroupModalOpen(true);
  };

  const openDetailDrawer = (record: MemberRecord) => {
    setDetailMember(record);
    setDetailTabKey('balance');
    setDetailDrawerOpen(true);
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
      if (detailMember && detailMember.id === selectedMember.id) {
        const updated = { ...detailMember, points: detailMember.points + values.amount };
        setDetailMember(updated);
        fetchDrawerData(selectedMember.id, detailTabKey);
      }
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
      if (detailMember && detailMember.id === selectedMember.id) {
        const updated = { ...detailMember, balance: detailMember.balance + amountCents };
        setDetailMember(updated);
        fetchDrawerData(selectedMember.id, detailTabKey);
      }
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
      if (detailMember && detailMember.id === selectedMember.id) {
        // Refetch the complete user detail to update calculated level
        const res = await axiosInstance.get(`/member/user/${selectedMember.id}`);
        setDetailMember(res.data);
      }
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
      if (detailMember && detailMember.id === selectedMember.id) {
        setDetailMember(prev => prev ? { ...prev, tagIds: values.tagIds } : null);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '分配标签失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLevel = async (values: any) => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/member/user/${selectedMember.id}/update-level`, {
        levelId: values.levelId || null,
      });
      message.success('会员等级手动修改成功');
      setLevelModalOpen(false);
      tableQueryResult.refetch();
      if (detailMember && detailMember.id === selectedMember.id) {
        const res = await axiosInstance.get(`/member/user/${selectedMember.id}`);
        setDetailMember(res.data);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '手动调级失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignGroup = async (values: any) => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/member/user/${selectedMember.id}/assign-group`, {
        groupId: values.groupId || null,
      });
      message.success('会员分组修改成功');
      setGroupModalOpen(false);
      tableQueryResult.refetch();
      if (detailMember && detailMember.id === selectedMember.id) {
        const res = await axiosInstance.get(`/member/user/${selectedMember.id}`);
        setDetailMember(res.data);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '分配分组失败');
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
      if (detailMember && detailMember.id === record.id) {
        const updatedUser = await axiosInstance.get(`/member/user/${record.id}`);
        setDetailMember(updatedUser.data);
        fetchDrawerData(record.id, detailTabKey);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '模拟签到失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 搜索过滤表单 */}
      <Card style={{ marginBottom: '16px' }} bodyStyle={{ padding: '16px' }}>
        <Form {...searchFormProps} layout="inline">
          <Form.Item name="nickname" label="会员昵称">
            <Input placeholder="输入昵称模糊搜索" allowClear />
          </Form.Item>
          <Form.Item name="mobile" label="手机号码">
            <Input placeholder="输入手机号精确搜索" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态" style={{ width: '120px' }}>
            <Select placeholder="不限" allowClear>
              <Select.Option value="ENABLE">启用</Select.Option>
              <Select.Option value="DISABLE">禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="levelId" label="会员等级" style={{ width: '150px' }}>
            <Select placeholder="不限" allowClear>
              {levelList.map(level => (
                <Select.Option key={level.id} value={level.id}>{level.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="groupId" label="会员分组" style={{ width: '150px' }}>
            <Select placeholder="不限" allowClear>
              {groupList.map(g => (
                <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                筛选
              </Button>
              <Button onClick={() => searchFormProps.form?.resetFields()} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <List title="会员列表">
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column 
            dataIndex="nickname" 
            title="会员信息 (点击查看详情)" 
            render={(nickname: string, record: MemberRecord) => (
              <Space 
                style={{ cursor: 'pointer' }}
                onClick={() => openDetailDrawer(record)}
              >
                <Avatar src={record.avatar} icon={<UserOutlined />} />
                <div>
                  <div style={{ fontWeight: '600', color: '#1890ff' }}>{nickname}</div>
                  <Space size={4}>
                    {record.level ? (
                      <Tag color="purple" icon={<TrophyOutlined />}>
                        {record.level.name}
                      </Tag>
                    ) : (
                      <Tag>普通会员</Tag>
                    )}
                    {record.group ? (
                      <Tag color="cyan" icon={<ApartmentOutlined />}>
                        {record.group.name}
                      </Tag>
                    ) : null}
                  </Space>
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
                      <Tag key={tagId}>Tag: {tagId}</Tag>
                    );
                  })}
                </Space>
              );
            }}
          />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={90}
            render={(status: string, record: MemberRecord) => (
              <Switch 
                checked={status === 'ENABLE'} 
                onChange={(checked) => handleStatusChange(record, checked)} 
                checkedChildren="开"
                unCheckedChildren="关"
              />
            )}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={320}
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
                  icon={<TrophyOutlined style={{ color: '#722ed1' }} />} 
                  onClick={() => openLevelModal(record)}
                >
                  等级
                </Button>
                <Button 
                  size="small" 
                  icon={<ApartmentOutlined style={{ color: '#08979c' }} />} 
                  onClick={() => openGroupModal(record)}
                >
                  分组
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

      {/* 侧边详情画像抽屉 */}
      <Drawer
        title="会员 360° 全景画像详情"
        width={800}
        placement="right"
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
        bodyStyle={{ background: '#f5f5f5', padding: '16px' }}
      >
        {detailMember && (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {/* 会员基本名片 */}
            <Card>
              <Row align="middle" gutter={24}>
                <Col span={4}>
                  <Avatar size={80} src={detailMember.avatar} icon={<UserOutlined />} />
                </Col>
                <Col span={10}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{detailMember.nickname}</h3>
                  <div style={{ marginTop: '4px', color: '#8c8c8c' }}>手机号：{detailMember.mobile}</div>
                  <div style={{ marginTop: '8px' }}>
                    <Space size={6}>
                      <Switch 
                        size="small"
                        checked={detailMember.status === 'ENABLE'} 
                        onChange={(checked) => handleStatusChange(detailMember, checked)}
                      />
                      <span>{detailMember.status === 'ENABLE' ? '激活启用' : '禁用状态'}</span>
                    </Space>
                  </div>
                </Col>
                <Col span={10} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#bfbfbf' }}>注册时间：{dayjs(detailMember.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div style={{ marginTop: '12px' }}>
                    <Space size={4}>
                      {detailMember.level ? <Tag color="purple">{detailMember.level.name}</Tag> : <Tag>普通会员</Tag>}
                      {detailMember.group ? <Tag color="cyan">{detailMember.group.name}</Tag> : <Tag>暂无分组</Tag>}
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 账户资产概览 */}
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="钱包可用余额" 
                    value={detailMember.balance / 100} 
                    precision={2} 
                    prefix="¥" 
                    valueStyle={{ color: '#cf1322' }} 
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="会员积分" 
                    value={detailMember.points} 
                    valueStyle={{ color: '#d46b08' }} 
                    suffix="分"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="累计成长值" 
                    value={detailMember.experience} 
                    valueStyle={{ color: '#722ed1' }} 
                  />
                </Card>
              </Col>
            </Row>

            {/* 流水明细 Tab 区域 */}
            <Card bodyStyle={{ padding: '8px 16px 16px 16px' }}>
              <Tabs activeKey={detailTabKey} onChange={setDetailTabKey}>
                <Tabs.TabPane tab={<span><WalletOutlined />余额账单流水</span>} key="balance">
                  <Table 
                    dataSource={balanceRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="id" title="流水ID" width={70} />
                    <Table.Column 
                      dataIndex="balance" 
                      title="变动金额" 
                      render={(val: number) => (
                        <span style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
                          {val >= 0 ? '+' : ''}{(val / 100).toFixed(2)} 元
                        </span>
                      )}
                    />
                    <Table.Column 
                      dataIndex="afterBalance" 
                      title="变动后余额" 
                      render={(val: number) => `¥${(val / 100).toFixed(2)}`}
                    />
                    <Table.Column dataIndex="description" title="原因描述" />
                    <Table.Column dataIndex="operatorId" title="操作员" width={90} />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="产生时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><StarOutlined />积分日志流水</span>} key="point">
                  <Table 
                    dataSource={pointRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="id" title="流水ID" width={70} />
                    <Table.Column 
                      dataIndex="point" 
                      title="变动积分" 
                      render={(val: number) => (
                        <span style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
                          {val >= 0 ? '+' : ''}{val}
                        </span>
                      )}
                    />
                    <Table.Column dataIndex="afterPoint" title="变动后积分" />
                    <Table.Column dataIndex="description" title="描述" />
                    <Table.Column dataIndex="operatorId" title="操作员" width={90} />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="产生时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><CalendarOutlined />签到轨迹历史</span>} key="signin">
                  <Table 
                    dataSource={signInRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="id" title="记录ID" width={70} />
                    <Table.Column dataIndex="day" title="连续签到天数" render={(day) => `第 ${day} 天`} />
                    <Table.Column 
                      dataIndex="point" 
                      title="奖励积分" 
                      render={(val) => <span style={{ color: '#d46b08', fontWeight: 'bold' }}>+{val} 分</span>}
                    />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="签到时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><ShoppingCartOutlined />消费订单记录</span>} key="order">
                  <Table 
                    dataSource={orderRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="no" title="订单编号" />
                    <Table.Column 
                      dataIndex="payPrice" 
                      title="实付金额" 
                      render={(val) => <strong style={{ color: '#cf1322' }}>¥{(val / 100).toFixed(2)}</strong>} 
                    />
                    <Table.Column 
                      dataIndex="status" 
                      title="订单状态" 
                      render={(status) => {
                        const maps: any = {
                          UNPAID: { label: '待支付', color: 'orange' },
                          UNDELIVERED: { label: '待发货', color: 'blue' },
                          DELIVERED: { label: '已发货', color: 'purple' },
                          COMPLETED: { label: '已完成', color: 'green' },
                          CANCELLED: { label: '已取消', color: 'default' },
                        };
                        const config = maps[status] || { label: status, color: 'default' };
                        return <Tag color={config.color}>{config.label}</Tag>;
                      }}
                    />
                    <Table.Column 
                      title="收货地址" 
                      render={(_, record: any) => (
                        <div style={{ fontSize: '11px' }}>
                          <div>{record.receiverName} ({record.receiverMobile})</div>
                          <div style={{ color: '#8c8c8c' }}>{record.receiverAddress}</div>
                        </div>
                      )} 
                    />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="下单时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><EnvironmentOutlined />收货地址列表</span>} key="address">
                  <Table 
                    dataSource={addressRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="id" title="地址ID" width={80} />
                    <Table.Column dataIndex="name" title="收件人" width={120} />
                    <Table.Column dataIndex="mobile" title="手机号" width={130} />
                    <Table.Column dataIndex="areaId" title="地区编码" width={100} render={(val) => val || '-'} />
                    <Table.Column dataIndex="detailAddress" title="收货详细地址" />
                    <Table.Column 
                      dataIndex="defaultStatus" 
                      title="是否默认" 
                      width={100}
                      render={(val: boolean) => (
                        <Tag color={val ? 'green' : 'default'}>
                          {val ? '默认' : '否'}
                        </Tag>
                      )}
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><GiftOutlined />优惠券资产</span>} key="coupon">
                  <Table 
                    dataSource={couponRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column 
                      dataIndex={['coupon', 'name']} 
                      title="优惠券名称" 
                    />
                    <Table.Column 
                      dataIndex={['coupon', 'type']} 
                      title="类型" 
                      render={(type) => type === 'CASH' ? '代金券' : '折扣券'}
                    />
                    <Table.Column 
                      title="优惠内容" 
                      render={(_, record: any) => {
                        const c = record.coupon;
                        if (!c) return '-';
                        return c.type === 'CASH' 
                          ? `减 ¥${(c.value / 100).toFixed(2)}` 
                          : `${(c.discount / 10).toFixed(1)}折`;
                      }}
                    />
                    <Table.Column 
                      dataIndex="status" 
                      title="使用状态" 
                      render={(status) => {
                        const maps: any = {
                          UNUSED: { label: '未使用', color: 'orange' },
                          USED: { label: '已使用', color: 'green' },
                          EXPIRED: { label: '已过期', color: 'default' },
                        };
                        const config = maps[status] || { label: status, color: 'default' };
                        return <Tag color={config.color}>{config.label}</Tag>;
                      }}
                    />
                    <Table.Column 
                      title="有效期" 
                      render={(_, record: any) => (
                        <span style={{ fontSize: '11px', color: '#555' }}>
                          {dayjs(record.validStartTime).format('YYYY-MM-DD')} ~ {dayjs(record.validEndTime).format('YYYY-MM-DD')}
                        </span>
                      )}
                    />
                    <Table.Column 
                      dataIndex="usedTime" 
                      title="使用时间" 
                      render={(val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '-'} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><TrophyOutlined />成长值变动流水</span>} key="experience">
                  <Table 
                    dataSource={expRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="id" title="流水ID" width={70} />
                    <Table.Column 
                      dataIndex="experience" 
                      title="变动成长值" 
                      render={(val: number) => (
                        <span style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
                          {val >= 0 ? '+' : ''}{val}
                        </span>
                      )}
                    />
                    <Table.Column dataIndex="afterExperience" title="变动后成长值" />
                    <Table.Column dataIndex="description" title="原因描述" />
                    <Table.Column dataIndex="operatorId" title="操作员" width={90} />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="产生时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><ReloadOutlined />退款售后记录</span>} key="refund">
                  <Table 
                    dataSource={refundRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="no" title="退款编号" />
                    <Table.Column 
                      dataIndex="refundPrice" 
                      title="实退金额" 
                      render={(val) => <strong style={{ color: '#cf1322' }}>¥{(val / 100).toFixed(2)}</strong>} 
                    />
                    <Table.Column 
                      dataIndex="status" 
                      title="退款状态" 
                      render={(status) => {
                        const maps: any = {
                          APPLY: { label: '待审批', color: 'orange' },
                          APPROVED: { label: '已同意', color: 'green' },
                          REJECTED: { label: '已拒绝', color: 'red' },
                        };
                        const config = maps[status] || { label: status, color: 'default' };
                        return <Tag color={config.color}>{config.label}</Tag>;
                      }}
                    />
                    <Table.Column dataIndex="reason" title="退款原因" />
                    <Table.Column dataIndex="auditRemark" title="审核备注" render={(val) => val || '-'} />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="申请时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>

                <Tabs.TabPane tab={<span><TrophyOutlined />等级变动历史</span>} key="level_history">
                  <Table 
                    dataSource={levelRecords} 
                    rowKey="id" 
                    loading={loadingDrawerData} 
                    size="small"
                    pagination={{ pageSize: 5 }}
                  >
                    <Table.Column dataIndex="id" title="流水ID" width={70} />
                    <Table.Column 
                      dataIndex="oldLevelName" 
                      title="变动前等级" 
                      render={(val) => val ? <Tag color="blue">{val}</Tag> : <Tag>普通会员</Tag>}
                    />
                    <Table.Column 
                      dataIndex="newLevelName" 
                      title="变动后等级" 
                      render={(val) => val ? <Tag color="purple">{val}</Tag> : <Tag>普通会员</Tag>}
                    />
                    <Table.Column dataIndex="experience" title="变动时成长值" />
                    <Table.Column dataIndex="description" title="原因描述" />
                    <Table.Column dataIndex="operatorId" title="操作员" width={90} />
                    <Table.Column 
                      dataIndex="createdAt" 
                      title="变动时间" 
                      render={(val) => dayjs(val).format('YYYY-MM-DD HH:mm:ss')} 
                    />
                  </Table>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Space>
        )}
      </Drawer>

      {/* MODAL 1: Adjust Points */}
      <Modal forceRender
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
      <Modal forceRender
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

      {/* MODAL 3: Adjust Experience */}
      <Modal forceRender
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
      <Modal forceRender
        title={selectedMember ? `分配标签 - ${selectedMember.nickname}` : '分配标签'}
        open={tagsModalOpen}
        onCancel={() => setTagsModalOpen(false)}
        onOk={() => tagsForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={tagsForm} layout="vertical" onFinish={handleAssignTags}>
          <Form.Item name="tagIds" label="选择标签">
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

      {/* MODAL 5: Manual Adjust Level */}
      <Modal forceRender
        title={selectedMember ? `修改会员等级 - ${selectedMember.nickname}` : '修改等级'}
        open={levelModalOpen}
        onCancel={() => setLevelModalOpen(false)}
        onOk={() => levelForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={levelForm} layout="vertical" onFinish={handleUpdateLevel}>
          <Form.Item name="levelId" label="选择会员等级 (置空代表普通会员)">
            <Select placeholder="选择会员等级" allowClear style={{ width: '100%' }}>
              {levelList.map(l => (
                <Select.Option key={l.id} value={l.id}>{l.name} (Lvl {l.level})</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 6: Assign Group */}
      <Modal forceRender
        title={selectedMember ? `修改所属分组 - ${selectedMember.nickname}` : '修改分组'}
        open={groupModalOpen}
        onCancel={() => setGroupModalOpen(false)}
        onOk={() => groupForm.submit()}
        confirmLoading={submitting}
      >
        <Form form={groupForm} layout="vertical" onFinish={handleAssignGroup}>
          <Form.Item name="groupId" label="选择会员分组 (置空代表取消分组)">
            <Select placeholder="选择分组" allowClear style={{ width: '100%' }}>
              {groupList.map(g => (
                <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
