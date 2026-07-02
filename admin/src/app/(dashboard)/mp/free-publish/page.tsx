'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { Card, Space, Button, Table, Select, Popconfirm, message, Typography } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpFreePublishList() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  
  const [articles, setArticles] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  // 1. 获取所有公众号账号
  React.useEffect(() => {
    axiosInstance.get('/mp/account').then((res: any) => {
      const data = res.data?.data || res.data || [];
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    });
  }, []);

  // 2. 拉取已群发的已发表列表
  const fetchArticles = async () => {
    if (!selectedAccountId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/mp/free-publish/page?accountId=${selectedAccountId}&page=${page}&size=${size}`);
      const result = res.data?.data || res.data;
      setArticles(result.list || []);
      setTotal(result.total || 0);
    } catch {
      message.error('加载发表记录失败，请检查微信账号接口权限');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchArticles();
  }, [selectedAccountId, page, size]);

  // 3. 一键撤回
  const handleRecall = async (articleId: string) => {
    try {
      await axiosInstance.delete(`/mp/free-publish/delete?accountId=${selectedAccountId}&articleId=${articleId}`);
      message.success('已群发的文章成功从粉丝手机上撤回！');
      fetchArticles();
    } catch (e: any) {
      message.error(e.response?.data?.message || '撤回失败');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>公众号账号：</span>
        <Select
          style={{ width: 220 }}
          placeholder="选择公众号"
          value={selectedAccountId}
          onChange={(v) => { setSelectedAccountId(v); setPage(1); }}
          options={accounts.map((a) => ({ label: a.name, value: a.id }))}
        />
      </div>

      <Card title="已发表群发记录" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <Table
          dataSource={articles}
          loading={loading}
          rowKey="article_id"
          pagination={{
            current: page,
            pageSize: size,
            total,
            onChange: (p, s) => { setPage(p); setSize(s); },
            showSizeChanger: true,
          }}
        >
          <Table.Column
            title="图文封面 & 标题"
            render={(_, r: any) => {
              const article = r.content?.news_item?.[0] || {};
              return (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {article.thumb_url && <img src={article.thumb_url} alt="封面" style={{ width: 60, height: 40, borderRadius: 4, objectFit: 'cover' }} />}
                  <div>
                    <Typography.Text strong>{article.title || '无标题'}</Typography.Text>
                    <div style={{ fontSize: 12, color: '#999' }}>作者: {article.author || '-'}</div>
                  </div>
                </div>
              );
            }}
          />
          <Table.Column
            title="摘要"
            render={(_, r: any) => {
              const article = r.content?.news_item?.[0] || {};
              return <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>{article.digest || '-'}</Typography.Paragraph>;
            }}
          />
          <Table.Column
            title="发表时间"
            dataIndex="update_time"
            width={180}
            render={(t: number) => new Date(t * 1000).toLocaleString()}
          />
          <Table.Column
            title="操作"
            width={220}
            render={(_, r: any) => {
              const article = r.content?.news_item?.[0] || {};
              return (
                <Space>
                  {article.url && (
                    <Button size="small" type="link" icon={<EyeOutlined />} href={article.url} target="_blank">
                      查看图文页
                    </Button>
                  )}
                  <Popconfirm title="确定撤回/删除这条已发表群发？撤回后粉丝将无法打开此链接！" onConfirm={() => handleRecall(r.article_id)}>
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      一键撤回
                    </Button>
                  </Popconfirm>
                </Space>
              );
            }}
          />
        </Table>
      </Card>
    </div>
  );
}
