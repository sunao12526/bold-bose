'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Tag, 
  Radio, 
  DatePicker, 
  Switch, 
  Button, 
  Progress, 
  Tabs, 
  Row, 
  Col, 
  Card, 
  Popconfirm, 
  TreeSelect, 
  message,
  Statistic
} from 'antd';
import { 
  GiftOutlined, 
  SendOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';
import dayjs from 'dayjs';

export default function CouponPage() {
  const [activeTab, setActiveTab] = useState('templates');
  const [categories, setCategories] = useState<any[]>([]);
  const [spus, setSpus] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  
  // Templates state
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // Distribution modal state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [sendForm] = Form.useForm();

  // Claim history state
  const [userCoupons, setUserCoupons] = useState<any[]>([]);
  const [loadingUserCoupons, setLoadingUserCoupons] = useState(false);

  // Filters
  const [templateSearchName, setTemplateSearchName] = useState('');
  const [userCouponSearchMobile, setUserCouponSearchMobile] = useState('');
  const [userCouponSearchStatus, setUserCouponSearchStatus] = useState<string | undefined>(undefined);

  // Load baseline data (Categories, SPUs, Members)
  useEffect(() => {
    const loadBaselines = async () => {
      try {
        const [catRes, spuRes, memRes] = await Promise.all([
          axiosInstance.get('/mall/category'),
          axiosInstance.get('/mall/spu'),
          axiosInstance.get('/member/user')
        ]);
        setCategories(catRes.data || []);
        setSpus(spuRes.data?.items || spuRes.data || []);
        setMembers(memRes.data?.items || memRes.data || []);
      } catch (err) {
        console.error('Failed to load baseline dictionaries', err);
      }
    };
    loadBaselines();
  }, []);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await axiosInstance.get('/mall/coupon');
      setTemplates(res.data?.items || res.data || []);
    } catch (e) {
      message.error('加载优惠券模板失败');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchUserCoupons = async () => {
    setLoadingUserCoupons(true);
    try {
      const res = await axiosInstance.get('/mall/coupon/user-list');
      setUserCoupons(res.data || []);
    } catch (e) {
      message.error('加载会员领用记录失败');
    } finally {
      setLoadingUserCoupons(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'templates') {
      fetchTemplates();
    } else {
      fetchUserCoupons();
    }
  }, [activeTab]);

  const handleOpenSendModal = (record: any) => {
    setSelectedTemplate(record);
    sendForm.resetFields();
    setIsSendModalOpen(true);
  };

  const handleSendCoupon = async (values: any) => {
    if (!selectedTemplate) return;
    try {
      await axiosInstance.post(`/mall/coupon/${selectedTemplate.id}/send`, {
        memberIds: values.memberIds,
      });
      message.success('分发优惠券成功');
      setIsSendModalOpen(false);
      fetchTemplates();
    } catch (e: any) {
      message.error(e.response?.data?.message || '分发优惠券失败');
    }
  };

  const onFinishCreate = async (values: any) => {
    const payload: any = {
      name: values.name,
      type: values.type,
      totalCount: Number(values.totalCount),
      scopeType: values.scopeType,
      validityType: values.validityType,
    };

    payload.minPrice = Math.round(Number(values.minPrice || 0) * 100);

    if (values.type === 'CASH') {
      payload.value = Math.round(Number(values.value) * 100);
    } else {
      payload.value = Number(values.value);
    }

    if (values.scopeType === 'ALL') {
      payload.scopeValue = null;
    } else if (values.scopeType === 'CATEGORY') {
      payload.scopeValue = values.scopeValueCategory || [];
    } else if (values.scopeType === 'SPU') {
      payload.scopeValue = values.scopeValueSpu || [];
    }

    if (values.validityType === 'DATE') {
      if (values.validTime && values.validTime.length === 2) {
        payload.validStartTime = values.validTime[0].toDate();
        payload.validEndTime = values.validTime[1].toDate();
      }
      payload.validDays = null;
    } else {
      payload.validDays = Number(values.validDays);
      payload.validStartTime = null;
      payload.validEndTime = null;
    }

    try {
      await axiosInstance.post('/mall/coupon', payload);
      message.success('创建优惠券模板成功');
      setIsCreateModalOpen(false);
      createForm.resetFields();
      fetchTemplates();
    } catch (err: any) {
      message.error(err.response?.data?.message || '创建优惠券模板失败');
    }
  };

  const formatMoney = (cents: number) => {
    return `￥${(cents / 100).toFixed(2)}`;
  };

  const formatCouponValue = (record: any) => {
    if (record.type === 'CASH') {
      return `减免 ${(record.value / 100).toFixed(2)} 元`;
    } else {
      return `${(record.value / 10).toFixed(1)} 折`;
    }
  };

  const renderScope = (record: any) => {
    if (record.scopeType === 'ALL') {
      return <Tag color="blue">全场通用</Tag>;
    }
    const ids = Array.isArray(record.scopeValue) ? record.scopeValue : [];
    if (record.scopeType === 'CATEGORY') {
      const names = ids.map((id: number) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : `分类ID: ${id}`;
      });
      return (
        <Space direction="vertical" size={2}>
          <Tag color="cyan">指定分类</Tag>
          <span style={{ fontSize: '12px', color: '#666' }}>{names.join(', ')}</span>
        </Space>
      );
    }
    if (record.scopeType === 'SPU') {
      const names = ids.map((id: number) => {
        const spu = spus.find(s => s.id === id);
        return spu ? spu.name : `商品ID: ${id}`;
      });
      return (
        <Space direction="vertical" size={2}>
          <Tag color="orange">指定商品</Tag>
          <span style={{ fontSize: '12px', color: '#666' }}>{names.join(', ')}</span>
        </Space>
      );
    }
    return '-';
  };

  // Filter templates locally
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(templateSearchName.toLowerCase())
  );

  // Filter claimed user coupons locally
  const filteredUserCoupons = userCoupons.filter(uc => {
    const matchMobile = userCouponSearchMobile 
      ? uc.member?.mobile?.includes(userCouponSearchMobile) || uc.member?.nickname?.includes(userCouponSearchMobile)
      : true;
    const matchStatus = userCouponSearchStatus ? uc.status === userCouponSearchStatus : true;
    return matchMobile && matchStatus;
  });

  // Calculate quick analytics cards
  const totalTemplates = templates.length;
  const totalClaimed = templates.reduce((acc, t) => acc + t.takeCount, 0);
  const totalUsed = templates.reduce((acc, t) => acc + t.useCount, 0);
  const useRate = totalClaimed > 0 ? ((totalUsed / totalClaimed) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f1f1f' }}>
            <GiftOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            优惠券与营销管理
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c', fontSize: '14px' }}>
            配置商城优惠券模板，进行会员定向营销分发，追踪优惠券领取与核销记录。
          </p>
        </div>
        {activeTab === 'templates' && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              createForm.resetFields();
              setIsCreateModalOpen(true);
            }}
          >
            新建优惠券模板
          </Button>
        )}
      </div>

      {/* Analytics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title="优惠券模板总数" 
              value={totalTemplates} 
              prefix={<GiftOutlined style={{ color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title="已领用优惠券" 
              value={totalClaimed} 
              prefix={<SendOutlined style={{ color: '#52c41a' }} />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title="已使用优惠券" 
              value={totalUsed} 
              prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title="使用核销率" 
              value={useRate} 
              suffix="%" 
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />} 
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card variant="borderless" style={{ borderRadius: '8px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'templates',
              label: '优惠券模板',
              children: (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                    <Input
                      placeholder="搜索优惠券名称"
                      prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                      style={{ width: 260 }}
                      value={templateSearchName}
                      onChange={e => setTemplateSearchName(e.target.value)}
                      allowClear
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchTemplates}>刷新</Button>
                  </div>

                  <Table 
                    dataSource={filteredTemplates} 
                    rowKey="id" 
                    loading={loadingTemplates}
                    pagination={{ pageSize: 10 }}
                  >
                    <Table.Column dataIndex="id" title="ID" width={60} />
                    <Table.Column 
                      dataIndex="name" 
                      title="名称" 
                      render={(name) => <span style={{ fontWeight: '500', color: '#1890ff' }}>{name}</span>}
                    />
                    <Table.Column 
                      dataIndex="type" 
                      title="类型" 
                      width={100}
                      render={(type) => (
                        <Tag color={type === 'CASH' ? 'red' : 'green'}>
                          {type === 'CASH' ? '代金券' : '折扣券'}
                        </Tag>
                      )}
                    />
                    <Table.Column 
                      title="优惠额度" 
                      width={120}
                      render={(_, record: any) => formatCouponValue(record)}
                    />
                    <Table.Column 
                      dataIndex="minPrice" 
                      title="使用门槛" 
                      width={120}
                      render={(price) => price === 0 ? '无门槛' : `满 ${formatMoney(price)}`}
                    />
                    <Table.Column 
                      title="适用范围" 
                      width={200}
                      render={(_, record: any) => renderScope(record)}
                    />
                    <Table.Column 
                      title="发放进度" 
                      width={200}
                      render={(_, record: any) => {
                        const percent = record.totalCount > 0 ? (record.takeCount / record.totalCount) * 100 : 0;
                        return (
                          <div style={{ width: '150px' }}>
                            <Progress percent={Math.round(percent)} size="small" status={percent >= 100 ? 'normal' : 'active'} />
                            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                              已领 {record.takeCount} / 共 {record.totalCount} 张 (已用 {record.useCount})
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Table.Column 
                      title="有效期" 
                      width={220}
                      render={(_, record: any) => {
                        if (record.validityType === 'DATE') {
                          return (
                            <span style={{ fontSize: '13px' }}>
                              {dayjs(record.validStartTime).format('YYYY-MM-DD HH:mm')}<br/>
                              至 {dayjs(record.validEndTime).format('YYYY-MM-DD HH:mm')}
                            </span>
                          );
                        } else {
                          return <Tag color="purple">领取后 {record.validDays} 天内有效</Tag>;
                        }
                      }}
                    />
                    <Table.Column 
                      dataIndex="status" 
                      title="状态" 
                      width={80}
                      render={(status, record: any) => (
                        <Switch
                          checked={status === 'ENABLE'}
                          onChange={async (checked) => {
                            const newStatus = checked ? 'ENABLE' : 'DISABLE';
                            try {
                              await axiosInstance.put(`/mall/coupon/${record.id}/status`, { status: newStatus });
                              message.success('更新状态成功');
                              fetchTemplates();
                            } catch (e: any) {
                              message.error(e.response?.data?.message || '更新状态失败');
                            }
                          }}
                        />
                      )}
                    />
                    <Table.Column
                      title="操作"
                      key="action"
                      width={180}
                      render={(_, record: any) => (
                        <Space size="middle">
                          <Button 
                            type="link" 
                            icon={<SendOutlined />} 
                            onClick={() => handleOpenSendModal(record)}
                            disabled={record.status !== 'ENABLE' || record.takeCount >= record.totalCount}
                          >
                            分发会员
                          </Button>
                          <Popconfirm
                            title="确定要删除这个优惠券模板吗？"
                            onConfirm={async () => {
                              try {
                                await axiosInstance.delete(`/mall/coupon/${record.id}`);
                                message.success('删除成功');
                                fetchTemplates();
                              } catch (e: any) {
                                message.error(e.response?.data?.message || '删除失败');
                              }
                            }}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                          </Popconfirm>
                        </Space>
                      )}
                    />
                  </Table>
                </>
              ),
            },
            {
              key: 'history',
              label: '会员领用记录',
              children: (
                <>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Input
                      placeholder="搜索会员昵称/手机号"
                      prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                      style={{ width: 240 }}
                      value={userCouponSearchMobile}
                      onChange={e => setUserCouponSearchMobile(e.target.value)}
                      allowClear
                    />
                    <Select
                      placeholder="过滤使用状态"
                      style={{ width: 150 }}
                      value={userCouponSearchStatus}
                      onChange={setUserCouponSearchStatus}
                      allowClear
                    >
                      <Select.Option value="UNUSED">未使用</Select.Option>
                      <Select.Option value="USED">已使用</Select.Option>
                      <Select.Option value="EXPIRED">已过期</Select.Option>
                    </Select>
                    <Button icon={<ReloadOutlined />} onClick={fetchUserCoupons}>刷新</Button>
                  </div>

                  <Table 
                    dataSource={filteredUserCoupons} 
                    rowKey="id" 
                    loading={loadingUserCoupons}
                    pagination={{ pageSize: 10 }}
                  >
                    <Table.Column dataIndex="id" title="记录 ID" width={80} />
                    <Table.Column 
                      title="会员" 
                      render={(_, record: any) => (
                        <div>
                          <span style={{ fontWeight: '500' }}>{record.member?.nickname || '未知用户'}</span>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.member?.mobile || '-'}</div>
                        </div>
                      )}
                    />
                    <Table.Column 
                      title="优惠券" 
                      render={(_, record: any) => (
                        <div>
                          <span style={{ fontWeight: '500', color: '#1890ff' }}>{record.coupon?.name}</span>
                          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {formatCouponValue(record.coupon)} | {record.coupon?.minPrice === 0 ? '无门槛' : `满 ${(record.coupon?.minPrice / 100).toFixed(2)}`}
                          </div>
                        </div>
                      )}
                    />
                    <Table.Column 
                      title="使用限制" 
                      render={(_, record: any) => renderScope(record.coupon)}
                    />
                    <Table.Column 
                      title="有效期限" 
                      width={220}
                      render={(_, record: any) => (
                        <span style={{ fontSize: '13px' }}>
                          {dayjs(record.validStartTime).format('YYYY-MM-DD HH:mm')}<br/>
                          至 {dayjs(record.validEndTime).format('YYYY-MM-DD HH:mm')}
                        </span>
                      )}
                    />
                    <Table.Column 
                      dataIndex="status" 
                      title="使用状态" 
                      width={120}
                      render={(status) => {
                        if (status === 'UNUSED') return <Tag color="blue" icon={<ClockCircleOutlined />}>未使用</Tag>;
                        if (status === 'USED') return <Tag color="green" icon={<CheckCircleOutlined />}>已使用</Tag>;
                        return <Tag color="red" icon={<CloseCircleOutlined />}>已过期</Tag>;
                      }}
                    />
                    <Table.Column 
                      title="核销时间 / 订单ID" 
                      render={(_, record: any) => {
                        if (record.status !== 'USED') return '-';
                        return (
                          <div>
                            {record.useTime ? dayjs(record.useTime).format('YYYY-MM-DD HH:mm') : '-'}<br/>
                            <Tag color="cyan">订单ID: {record.useOrderId || '-'}</Tag>
                          </div>
                        );
                      }}
                    />
                  </Table>
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* MODAL 1: 创建优惠券模板 */}
      <Modal forceRender
        title="创建优惠券模板"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={() => createForm.submit()}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={onFinishCreate}
          initialValues={{
            type: 'CASH',
            minPrice: 0,
            scopeType: 'ALL',
            validityType: 'DATE'
          }}
        >
          <Form.Item
            name="name"
            label="优惠券名称"
            rules={[{ required: true, message: '请输入优惠券名称' }, { max: 100, message: '长度不能超过100个字符' }]}
          >
            <Input placeholder="例：全场百元代金券" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="优惠券类型">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="CASH">代金券</Radio.Button>
                  <Radio.Button value="DISCOUNT">折扣券</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
              >
                {({ getFieldValue }) => {
                  const type = getFieldValue('type') || 'CASH';
                  return type === 'CASH' ? (
                    <Form.Item
                      name="value"
                      label="优惠金额 (元)"
                      rules={[{ required: true, message: '请输入优惠金额' }]}
                    >
                      <InputNumber min={0.01} precision={2} style={{ width: '100%' }} placeholder="例: 10.00" />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="value"
                      label="折扣比例 (%)"
                      rules={[
                        { required: true, message: '请输入折扣比例' },
                        { type: 'number', min: 1, max: 99, message: '折扣范围为 1 至 99 之间' }
                      ]}
                    >
                      <InputNumber min={1} max={99} precision={0} style={{ width: '100%' }} placeholder="例: 85 表示 8.5折" />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minPrice"
                label="满多少元可用"
                rules={[{ required: true, message: '请输入起用门槛金额' }]}
              >
                <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="0表示无门槛，例: 100.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalCount"
                label="发行总量 (张)"
                rules={[{ required: true, message: '请输入发放上限张数' }]}
              >
                <InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="最大可领张数" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="scopeType" label="适用范围">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="ALL">全场通用</Radio.Button>
              <Radio.Button value="CATEGORY">指定分类</Radio.Button>
              <Radio.Button value="SPU">指定商品</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.scopeType !== currentValues.scopeType}
          >
            {({ getFieldValue }) => {
              const scopeType = getFieldValue('scopeType') || 'ALL';
              if (scopeType === 'CATEGORY') {
                return (
                  <Form.Item
                    name="scopeValueCategory"
                    label="指定商品分类"
                    rules={[{ required: true, message: '请选择商品分类' }]}
                  >
                    <TreeSelect
                      treeDataSimpleMode
                      style={{ width: '100%' }}
                      styles={{ popup: { root: { maxHeight: 400, overflow: 'auto' } } }}
                      placeholder="可多选商品分类"
                      multiple
                      treeDefaultExpandAll
                      treeData={categories.map(c => ({
                        id: c.id,
                        pId: c.parentId || 0,
                        value: c.id,
                        title: c.name,
                      }))}
                    />
                  </Form.Item>
                );
              }
              if (scopeType === 'SPU') {
                return (
                  <Form.Item
                    name="scopeValueSpu"
                    label="指定商品"
                    rules={[{ required: true, message: '请选择商品' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="可多选商品"
                      style={{ width: '100%' }}
                      options={spus.map(s => ({ label: s.name, value: s.id }))}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item name="validityType" label="有效期类型">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="DATE">固定时间段</Radio.Button>
              <Radio.Button value="TERM">领取后有效</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.validityType !== currentValues.validityType}
          >
            {({ getFieldValue }) => {
              const validityType = getFieldValue('validityType') || 'DATE';
              return validityType === 'DATE' ? (
                <Form.Item
                  name="validTime"
                  label="有效时间段"
                  rules={[{ required: true, message: '请选择有效时间段' }]}
                >
                  <DatePicker.RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              ) : (
                <Form.Item
                  name="validDays"
                  label="有效天数 (天)"
                  rules={[{ required: true, message: '请输入领取后有效天数' }]}
                >
                  <InputNumber min={1} precision={0} style={{ width: '100%' }} placeholder="例: 7 表示领券后7天内可用" />
                </Form.Item>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 2: 分发优惠券给会员 */}
      <Modal forceRender
        title={selectedTemplate ? `分发优惠券: ${selectedTemplate.name}` : '分发优惠券'}
        open={isSendModalOpen}
        onCancel={() => setIsSendModalOpen(false)}
        onOk={() => sendForm.submit()}
      >
        <Form
          form={sendForm}
          layout="vertical"
          onFinish={handleSendCoupon}
        >
          <div style={{ marginBottom: '16px', color: '#595959' }}>
            {selectedTemplate && (
              <div>
                <strong>额度:</strong> {formatCouponValue(selectedTemplate)} |{' '}
                <strong>库存尚余:</strong> {selectedTemplate.totalCount - selectedTemplate.takeCount} 张
              </div>
            )}
          </div>
          <Form.Item
            name="memberIds"
            label="选择发放目标会员"
            rules={[{ required: true, message: '请选择至少一个会员进行发放' }]}
          >
            <Select
              mode="multiple"
              placeholder="搜索或选择会员名称 / 手机号"
              style={{ width: '100%' }}
              options={members
                .filter(m => m.status === 'ENABLE')
                .map(m => ({ label: `${m.nickname} (${m.mobile})`, value: m.id }))}
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
