'use client';

export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import { List } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Tag, Tabs, Drawer, Button, Popconfirm, Divider, Row, Col, Card, Image, Descriptions, message, Select } from 'antd';
import { useTable } from '@refinedev/antd';
import { FileTextOutlined, EyeOutlined, EditOutlined, CarOutlined, DollarOutlined, StopOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

interface OrderItem {
  id: number;
  spuId: number;
  skuId: number;
  spuName: string;
  picUrl: string;
  properties: any[];
  price: number;
  count: number;
}

interface OrderRecord {
  id: number;
  no: string;
  memberId: number;
  status: 'UNPAID' | 'UNDELIVERED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  payPrice: number;
  totalPrice: number;
  discountPrice: number;
  deliveryStatus: boolean;
  logisticsCo?: string;
  logisticsNo?: string;
  receiverName: string;
  receiverMobile: string;
  receiverAddress: string;
  userRemark?: string;
  payTime?: string;
  deliveryTime?: string;
  receiveTime?: string;
  createdAt: string;
  member: {
    nickname: string;
    mobile: string;
  };
  items: OrderItem[];
}

export default function OrderList() {
  const { tableProps, tableQuery: tableQueryResult, setFilters } = useTable<OrderRecord>({
    resource: 'mall/order',
    syncWithLocation: true,
  });

  // Local state for modals & drawers
  const [activeTab, setActiveTab] = useState('ALL');
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  
  const [shipForm] = Form.useForm();
  const [adjustForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Tab change handler
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setFilters([
      {
        field: 'status',
        operator: 'eq',
        value: key === 'ALL' ? undefined : key,
      },
    ]);
  };

  const openDetailsDrawer = (record: OrderRecord) => {
    setSelectedOrder(record);
    setDetailsDrawerOpen(true);
  };

  const openShipModal = (record: OrderRecord) => {
    setSelectedOrder(record);
    shipForm.resetFields();
    setShipModalOpen(true);
  };

  const openAdjustModal = (record: OrderRecord) => {
    setSelectedOrder(record);
    adjustForm.setFieldsValue({
      totalPrice: record.totalPrice / 100,
      discountPrice: record.discountPrice / 100,
      payPrice: record.payPrice / 100,
    });
    setAdjustModalOpen(true);
  };

  // 1. Ship order
  const handleShip = async (values: any) => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/mall/order/${selectedOrder.id}/ship`, {
        logisticsCo: values.logisticsCo,
        logisticsNo: values.logisticsNo,
      });
      message.success('发货成功');
      setShipModalOpen(false);
      tableQueryResult.refetch();
      // If drawer is open, reload details
      if (detailsDrawerOpen) {
        reloadSelectedOrder(selectedOrder.id);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '发货失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Adjust Order Price
  const handleAdjustPrice = async (values: any) => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const discountPriceCents = Math.round(values.discountPrice * 100);
      const payPriceCents = Math.round(values.payPrice * 100);
      
      await axiosInstance.put(`/mall/order/${selectedOrder.id}/adjust-price`, {
        discountPrice: discountPriceCents,
        payPrice: payPriceCents,
      });
      message.success('订单改价成功');
      setAdjustModalOpen(false);
      tableQueryResult.refetch();
      if (detailsDrawerOpen) {
        reloadSelectedOrder(selectedOrder.id);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '改价失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Mock Pay Order
  const handlePayMock = async (id: number) => {
    try {
      await axiosInstance.put(`/mall/order/${id}/pay-mock`);
      message.success('模拟支付成功');
      tableQueryResult.refetch();
      if (detailsDrawerOpen) {
        reloadSelectedOrder(id);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '支付失败');
    }
  };

  // 4. Cancel Order
  const handleCancel = async (id: number) => {
    try {
      await axiosInstance.put(`/mall/order/${id}/cancel`);
      message.success('订单取消成功');
      tableQueryResult.refetch();
      if (detailsDrawerOpen) {
        reloadSelectedOrder(id);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '取消订单失败');
    }
  };

  // Reload selected order detail inside drawer
  const reloadSelectedOrder = async (id: number) => {
    try {
      const res = await axiosInstance.get(`/mall/order/${id}`);
      setSelectedOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Status Badge Mapper
  const statusMapper = {
    UNPAID: { color: 'gold', text: '待付款' },
    UNDELIVERED: { color: 'blue', text: '待发货' },
    DELIVERED: { color: 'cyan', text: '已发货' },
    COMPLETED: { color: 'green', text: '已完成' },
    CANCELLED: { color: 'red', text: '已取消' },
  };

  return (
    <div style={{ padding: '24px' }}>
      <List title="订单管理">
        <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ marginBottom: 16 }}>
          <Tabs.TabPane tab="全部" key="ALL" />
          <Tabs.TabPane tab="待付款" key="UNPAID" />
          <Tabs.TabPane tab="待发货" key="UNDELIVERED" />
          <Tabs.TabPane tab="已发货" key="DELIVERED" />
          <Tabs.TabPane tab="已完成" key="COMPLETED" />
          <Tabs.TabPane tab="已取消" key="CANCELLED" />
        </Tabs>

        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="no" title="订单编号" width={160} />
          <Table.Column 
            dataIndex="member" 
            title="会员用户" 
            width={150}
            render={(member: any) => member ? (
              <div>
                <div>{member.nickname}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{member.mobile}</div>
              </div>
            ) : '-'}
          />
          <Table.Column 
            dataIndex="items" 
            title="商品信息" 
            render={(items: OrderItem[]) => (
              <Space direction="vertical" style={{ width: '100%' }}>
                {items?.map((item) => (
                  <Space key={item.id} align="start">
                    <Image 
                      src={item.picUrl} 
                      alt="商品图" 
                      width={40} 
                      height={40} 
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                      fallback="https://placehold.co/100x100?text=No+Img"
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.spuName}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>
                        {item.properties?.map((p: any) => `${p.propertyName}: ${p.valueName}`).join(' | ')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        ¥{(item.price / 100).toFixed(2)} x {item.count}
                      </div>
                    </div>
                  </Space>
                ))}
              </Space>
            )}
          />
          <Table.Column 
            title="实付金额" 
            width={120}
            render={(_, record: OrderRecord) => (
              <div>
                <div style={{ fontWeight: '600', color: '#cf1322' }}>¥{(record.payPrice / 100).toFixed(2)}</div>
                <div style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through' }}>
                  ¥{(record.totalPrice / 100).toFixed(2)}
                </div>
              </div>
            )}
          />
          <Table.Column 
            dataIndex="status" 
            title="订单状态" 
            width={110}
            render={(status: keyof typeof statusMapper) => (
              <Tag color={statusMapper[status]?.color}>{statusMapper[status]?.text}</Tag>
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title="下单时间" 
            width={160}
            render={(val: string) => new Date(val).toLocaleString()}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={220}
            render={(_, record: OrderRecord) => (
              <Space wrap>
                <Button 
                  size="small" 
                  icon={<EyeOutlined />} 
                  onClick={() => openDetailsDrawer(record)}
                >
                  详情
                </Button>

                {record.status === 'UNPAID' && (
                  <>
                    <Button 
                      size="small" 
                      type="dashed"
                      icon={<EditOutlined />} 
                      onClick={() => openAdjustModal(record)}
                    >
                      改价
                    </Button>
                    <Popconfirm
                      title="确定模拟用户支付吗？"
                      onConfirm={() => handlePayMock(record.id)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button size="small" type="primary" icon={<DollarOutlined />}>
                        模拟支付
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="确定取消该订单吗？"
                      onConfirm={() => handleCancel(record.id)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button size="small" danger icon={<StopOutlined />}>
                        取消
                      </Button>
                    </Popconfirm>
                  </>
                )}

                {record.status === 'UNDELIVERED' && (
                  <Button 
                    size="small" 
                    type="primary"
                    icon={<CarOutlined />} 
                    onClick={() => openShipModal(record)}
                  >
                    发货
                  </Button>
                )}
              </Space>
            )}
          />
        </Table>
      </List>

      {/* Order Details Drawer */}
      <Drawer
        title={`订单详情 [${selectedOrder?.no}]`}
        placement="right"
        width={700}
        onClose={() => setDetailsDrawerOpen(false)}
        open={detailsDrawerOpen}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="基本信息" bordered size="small" column={2}>
              <Descriptions.Item label="订单编号" span={2}>{selectedOrder.no}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={statusMapper[selectedOrder.status]?.color}>{statusMapper[selectedOrder.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">{new Date(selectedOrder.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="付款时间">{selectedOrder.payTime ? new Date(selectedOrder.payTime).toLocaleString() : '未付款'}</Descriptions.Item>
              <Descriptions.Item label="发货时间">{selectedOrder.deliveryTime ? new Date(selectedOrder.deliveryTime).toLocaleString() : '未发货'}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }} />

            <Descriptions title="收货信息" bordered size="small" column={2}>
              <Descriptions.Item label="收货人">{selectedOrder.receiverName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{selectedOrder.receiverMobile}</Descriptions.Item>
              <Descriptions.Item label="收货地址" span={2}>{selectedOrder.receiverAddress}</Descriptions.Item>
              <Descriptions.Item label="买家备注" span={2}>{selectedOrder.userRemark || '-'}</Descriptions.Item>
            </Descriptions>

            {selectedOrder.deliveryStatus && (
              <>
                <Divider style={{ margin: '16px 0' }} />
                <Descriptions title="物流信息" bordered size="small" column={2}>
                  <Descriptions.Item label="快递公司">{selectedOrder.logisticsCo}</Descriptions.Item>
                  <Descriptions.Item label="快递单号">{selectedOrder.logisticsNo}</Descriptions.Item>
                </Descriptions>
              </>
            )}

            <Divider style={{ margin: '16px 0' }} />

            <h3 style={{ marginBottom: 12 }}>商品列表</h3>
            <Table dataSource={selectedOrder.items} pagination={false} rowKey="id" size="small">
              <Table.Column 
                dataIndex="picUrl" 
                title="商品图片" 
                width={70}
                render={(url: string) => <Image src={url} alt="商品" width={40} height={40} style={{ objectFit: 'cover', borderRadius: '4px' }} />}
              />
              <Table.Column dataIndex="spuName" title="商品名称" />
              <Table.Column 
                dataIndex="properties" 
                title="规格属性" 
                render={(props: any[]) => props?.map((p: any) => `${p.propertyName}: ${p.valueName}`).join(' | ') || '-'}
              />
              <Table.Column 
                dataIndex="price" 
                title="单价" 
                render={(val: number) => `¥${(val / 100).toFixed(2)}`}
              />
              <Table.Column dataIndex="count" title="数量" width={70} />
              <Table.Column 
                title="小计" 
                width={90}
                render={(_, item: OrderItem) => `¥${((item.price * item.count) / 100).toFixed(2)}`}
              />
            </Table>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ textAlign: 'right', fontSize: '14px' }}>
              <div style={{ marginBottom: 4 }}>商品总额: <span>¥{(selectedOrder.totalPrice / 100).toFixed(2)}</span></div>
              <div style={{ marginBottom: 4 }}>后台优惠: <span style={{ color: '#cf1322' }}>- ¥{(selectedOrder.discountPrice / 100).toFixed(2)}</span></div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: 8 }}>
                订单实付: <span style={{ color: '#cf1322' }}>¥{(selectedOrder.payPrice / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Deliver Shipment Modal */}
      <Modal
        title={`订单发货 [${selectedOrder?.no}]`}
        open={shipModalOpen}
        onCancel={() => setShipModalOpen(false)}
        onOk={() => shipForm.submit()}
        confirmLoading={submitting}
      >
        <Form
          form={shipForm}
          layout="vertical"
          onFinish={handleShip}
        >
          <Form.Item
            name="logisticsCo"
            label="快递公司"
            rules={[{ required: true, message: '请选择或输入快递公司' }]}
            initialValue="顺丰速运"
          >
            <Select>
              <Select.Option value="顺丰速运">顺丰速运</Select.Option>
              <Select.Option value="邮政速递">邮政速递 (EMS)</Select.Option>
              <Select.Option value="中通快递">中通快递</Select.Option>
              <Select.Option value="圆通速递">圆通速递</Select.Option>
              <Select.Option value="韵达快递">韵达快递</Select.Option>
              <Select.Option value="京东快递">京东快递</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="logisticsNo"
            label="快递单号"
            rules={[{ required: true, message: '请输入快递物流单号' }]}
          >
            <Input placeholder="请输入快递单号，如 SF1000289190" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Adjust Price Modal */}
      <Modal
        title={`订单改价 [${selectedOrder?.no}]`}
        open={adjustModalOpen}
        onCancel={() => setAdjustModalOpen(false)}
        onOk={() => adjustForm.submit()}
        confirmLoading={submitting}
      >
        <Form
          form={adjustForm}
          layout="vertical"
          onFinish={handleAdjustPrice}
          onValuesChange={(changed, all) => {
            if (changed.discountPrice !== undefined) {
              const total = all.totalPrice;
              const discount = changed.discountPrice;
              adjustForm.setFieldsValue({
                payPrice: Math.max(0, total - discount),
              });
            } else if (changed.payPrice !== undefined) {
              const total = all.totalPrice;
              const pay = changed.payPrice;
              adjustForm.setFieldsValue({
                discountPrice: Math.max(0, total - pay),
              });
            }
          }}
        >
          <Form.Item name="totalPrice" label="订单原价 (元)">
            <InputNumber disabled style={{ width: '100%' }} precision={2} />
          </Form.Item>

          <Form.Item
            name="discountPrice"
            label="优惠减免金额 (元)"
            rules={[{ required: true, message: '请输入优惠金额' }]}
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} precision={2} />
          </Form.Item>

          <Form.Item
            name="payPrice"
            label="改后实付金额 (元)"
            rules={[{ required: true, message: '请输入实付金额' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} precision={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
