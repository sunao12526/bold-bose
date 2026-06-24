'use client';

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import { Card, Form, InputNumber, Button, Space, message, Spin, Alert, Divider } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/lib/axios';

export default function MemberConfigPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosInstance.get('/member/config')
      .then(res => {
        form.setFieldsValue(res.data);
      })
      .catch(err => {
        message.error('加载全局会员配置失败');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [form]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      await axiosInstance.put('/member/config', values);
      message.success('会员配置保存成功');
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', color: '#8c8c8c' }}>正在加载配置中...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card 
        title={
          <Space>
            <SettingOutlined style={{ color: '#1677ff' }} />
            <span>全局会员设置 (Member Config)</span>
          </Space>
        }
        bordered={false}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
      >
        <Alert
          message="配置提示"
          description="在此处设置的规则会即时影响全局的订单积分抵现计算、下单赠送积分比例以及会员日常签到的基本点数。"
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            name="tradePointCashPercent"
            label="每单积分抵现的上限比例 (%)"
            tooltip="例如：设置为 10%，则该笔订单中积分最多可抵扣订单总金额的 10%"
            rules={[
              { required: true, message: '请输入抵扣上限比例' },
              { type: 'number', min: 0, max: 100, message: '比例必须在 0 - 100 之间' }
            ]}
          >
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber 
                style={{ width: '100%' }} 
                min={0} 
                max={100} 
                placeholder="请输入最大抵扣比例，0 表示不支持积分抵扣"
              />
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 12px',
                background: '#fafafa',
                border: '1px solid #d9d9d9',
                borderLeft: 'none',
                color: 'rgba(0, 0, 0, 0.45)',
                borderStartEndRadius: '6px',
                borderEndEndRadius: '6px'
              }}>%</span>
            </Space.Compact>
          </Form.Item>

          <Divider />

          <Form.Item
            name="tradePointGivePercent"
            label="消费 1 元赠送积分数"
            tooltip="例如：设置为 1，则用户每消费一元赠送 1 个积分点数"
            rules={[
              { required: true, message: '请输入赠送积分数' },
              { type: 'number', min: 0, message: '赠送积分数不能小于 0' }
            ]}
          >
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber 
                style={{ width: '100%' }} 
                min={0} 
                placeholder="用户每消费一元赠送的积分数"
              />
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 12px',
                background: '#fafafa',
                border: '1px solid #d9d9d9',
                borderLeft: 'none',
                color: 'rgba(0, 0, 0, 0.45)',
                borderStartEndRadius: '6px',
                borderEndEndRadius: '6px'
              }}>积分/元</span>
            </Space.Compact>
          </Form.Item>

          <Divider />

          <Form.Item
            name="signInPoint"
            label="签到基础奖励点数"
            tooltip="每日用户在前端或系统模拟签到时，获得的基础积分值"
            rules={[
              { required: true, message: '请输入签到基础奖励点数' },
              { type: 'number', min: 0, message: '基础点数不能小于 0' }
            ]}
          >
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber 
                style={{ width: '100%' }} 
                min={0} 
                placeholder="签到默认获得的基础奖励"
              />
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 12px',
                background: '#fafafa',
                border: '1px solid #d9d9d9',
                borderLeft: 'none',
                color: 'rgba(0, 0, 0, 0.45)',
                borderStartEndRadius: '6px',
                borderEndEndRadius: '6px'
              }}>积分</span>
            </Space.Compact>
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', textAlign: 'right' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={saving}
              size="large"
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
