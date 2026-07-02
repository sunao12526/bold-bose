'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { List } from '@refinedev/antd';
import { Table, Tag, Input, Space, Button, Select, Modal, Form, Drawer, Avatar, message, Card } from 'antd';
import { useTable } from '@refinedev/antd';
import { SyncOutlined, TagOutlined, MessageOutlined, EditOutlined, SendOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

export default function MpUserList() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  const [tags, setTags] = React.useState<any[]>([]);

  // Refine table hook
  const { tableProps, tableQuery, setFilters } = useTable({
    resource: 'mp/user',
    syncWithLocation: false,
  });

  const [syncing, setSyncing] = React.useState(false);

  // 备注弹窗状态
  const [remarkModalOpen, setRemarkModalOpen] = React.useState(false);
  const [tagModalOpen, setTagModalOpen] = React.useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [form] = Form.useForm();
  
  // 聊天状态
  const [chatMessages, setChatMessages] = React.useState<any[]>([]);
  const [replyText, setReplyText] = React.useState('');
  const [chatLoading, setChatLoading] = React.useState(false);

  // 1. 加载公众号账号
  React.useEffect(() => {
    axiosInstance.get('/mp/account').then((res: any) => {
      const data = res.data?.data || res.data || [];
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    });
  }, []);

  // 2. 加载当前公众号的标签，以便列表匹配名称
  const fetchTags = (accountId: number) => {
    axiosInstance.get(`/mp/tag?accountId=${accountId}`).then((res: any) => {
      setTags(res.data?.data || res.data || []);
    });
  };

  // 3. 切换公众号时重新加载粉丝和标签
  React.useEffect(() => {
    if (selectedAccountId !== null) {
      setFilters([
        {
          field: 'accountId',
          operator: 'eq',
          value: selectedAccountId,
        },
      ]);
      fetchTags(selectedAccountId);
    }
  }, [selectedAccountId]);

  const handleSyncUser = async () => {
    if (!selectedAccountId) return;
    setSyncing(true);
    try {
      await axiosInstance.post(`/mp/user/sync?accountId=${selectedAccountId}`);
      message.success('已启动后台同步粉丝任务，请稍后刷新列表查看。');
      setTimeout(() => tableQuery.refetch(), 1500);
    } catch (e: any) {
      message.error(e.response?.data?.message || '同步失败');
    } finally {
      setSyncing(false);
    }
  };

  // 弹出修改备注框
  const openRemarkModal = (user: any) => {
    setCurrentUser(user);
    form.setFieldsValue({ remark: user.remark });
    setRemarkModalOpen(true);
  };

  const handleRemarkSubmit = async (values: any) => {
    try {
      await axiosInstance.put(`/mp/user/${currentUser.id}`, { remark: values.remark });
      message.success('修改备注成功');
      setRemarkModalOpen(false);
      tableQuery.refetch();
    } catch (e: any) {
      message.error(e.response?.data?.message || '操作失败');
    }
  };

  // 弹出打标签框
  const openTagModal = (user: any) => {
    setCurrentUser(user);
    const userTagIds = user.tagIds ? JSON.parse(user.tagIds) : [];
    form.setFieldsValue({ tagIds: userTagIds });
    setTagModalOpen(true);
  };

  const handleTagSubmit = async (values: any) => {
    try {
      await axiosInstance.put(`/mp/user/${currentUser.id}`, { tagIds: values.tagIds });
      message.success('设置标签成功');
      setTagModalOpen(false);
      tableQuery.refetch();
    } catch (e: any) {
      message.error(e.response?.data?.message || '操作失败');
    }
  };

  // 弹出客服聊天框
  const openChatDrawer = async (user: any) => {
    setCurrentUser(user);
    setChatDrawerOpen(true);
    setChatLoading(true);
    try {
      const res = await axiosInstance.get(`/mp/message?accountId=${selectedAccountId}&openid=${user.openid}`);
      setChatMessages((res.data?.data || res.data || []).reverse()); // 排序颠倒，时间旧的在顶部
    } catch (e) {
      message.error('加载历史消息失败');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !currentUser) return;
    try {
      const res = await axiosInstance.post('/mp/message/send', {
        accountId: selectedAccountId,
        openid: currentUser.openid,
        type: 'text',
        content: replyText,
      });
      message.success('消息已发送');
      
      const newMsg = res.data?.data || res.data;
      setChatMessages(prev => [...prev, newMsg]);
      setReplyText('');
    } catch (e: any) {
      message.error(e.response?.data?.message || '发送失败，客服消息通常需在粉丝互动后48小时内发送');
    }
  };

  // 格式化标签显示
  const renderUserTags = (tagIdsStr: string) => {
    if (!tagIdsStr) return null;
    try {
      const tagIds: number[] = JSON.parse(tagIdsStr);
      return tagIds.map(tid => {
        const matchedTag = tags.find(t => t.tagId === tid);
        return (
          <Tag color="blue" key={tid} style={{ margin: '2px' }}>
            {matchedTag ? matchedTag.name : `标签(${tid})`}
          </Tag>
        );
      });
    } catch {
      return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>当前公众号：</span>
        <Select
          style={{ width: 220 }}
          placeholder="请选择公众号"
          value={selectedAccountId}
          onChange={(v) => setSelectedAccountId(v)}
          options={accounts.map((a) => ({ label: a.name, value: a.id }))}
        />
      </div>

      <List
        title="粉丝管理"
        headerProps={{
          extra: (
            <Button type="primary" icon={<SyncOutlined spin={syncing} />} onClick={handleSyncUser} loading={syncing}>
              同步粉丝
            </Button>
          ),
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={60} />
          <Table.Column
            title="头像"
            dataIndex="headImageUrl"
            width={60}
            render={(url: string) => <Avatar src={url} size="small" />}
          />
          <Table.Column dataIndex="nickname" title="昵称" />
          <Table.Column dataIndex="remark" title="备注" render={(r: string) => r || '-'} />
          <Table.Column
            title="性别"
            dataIndex="sex"
            width={60}
            render={(s: number) => (s === 1 ? '男' : s === 2 ? '女' : '未知')}
          />
          <Table.Column
            title="标签"
            dataIndex="tagIds"
            render={(val: string) => renderUserTags(val)}
          />
          <Table.Column
            title="关注状态"
            dataIndex="subscribeStatus"
            width={90}
            render={(s: number) => (
              <Tag color={s === 1 ? 'green' : 'red'}>{s === 1 ? '已关注' : '已取关'}</Tag>
            )}
          />
          <Table.Column
            title="关注时间"
            dataIndex="subscribeTime"
            width={160}
            render={(t: string) => (t ? new Date(t).toLocaleString() : '-')}
          />
          <Table.Column
            title="操作"
            width={280}
            render={(_, r: any) => (
              <Space>
                <Button size="small" icon={<EditOutlined />} onClick={() => openRemarkModal(r)}>
                  备注
                </Button>
                <Button size="small" icon={<TagOutlined />} onClick={() => openTagModal(r)}>
                  标签
                </Button>
                <Button size="small" type="primary" ghost icon={<MessageOutlined />} onClick={() => openChatDrawer(r)}>
                  发送消息
                </Button>
              </Space>
            )}
          />
        </Table>
      </List>

      {/* 修改备注弹窗 */}
      <Modal
        title="修改粉丝备注"
        open={remarkModalOpen}
        onCancel={() => setRemarkModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleRemarkSubmit}>
          <Form.Item name="remark" label="粉丝备注名">
            <Input placeholder="输入备注名" maxLength={30} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 打标签弹窗 */}
      <Modal
        title="粉丝标签管理"
        open={tagModalOpen}
        onCancel={() => setTagModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleTagSubmit}>
          <Form.Item name="tagIds" label="选择标签">
            <Select
              mode="multiple"
              placeholder="为该粉丝分配标签"
              options={tags.map(t => ({ label: t.name, value: t.tagId }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 客服聊天 Drawer */}
      <Drawer
        title={currentUser ? `与粉丝 [ ${currentUser.nickname} ] 对话` : '客服消息'}
        width={450}
        onClose={() => setChatDrawerOpen(false)}
        open={chatDrawerOpen}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5' } }}
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {chatLoading ? (
            <div style={{ textAlign: 'center', marginTop: 20 }}><SyncOutlined spin /> 正在读取会话...</div>
          ) : chatMessages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>暂无聊天记录</div>
          ) : (
            chatMessages.map((msg, index) => {
              const isUser = msg.sendFrom === 1; // 1代表用户发送，2系统发送
              return (
                <div key={index} style={{ display: 'flex', flexDirection: isUser ? 'row' : 'row-reverse', marginBottom: 16 }}>
                  <Avatar src={isUser ? currentUser.headImageUrl : undefined} style={{ backgroundColor: isUser ? undefined : '#1890ff' }}>
                    {isUser ? null : '客服'}
                  </Avatar>
                  <div
                    style={{
                      maxWidth: '70%',
                      margin: isUser ? '0 0 0 12px' : '0 12px 0 0',
                      padding: '10px 14px',
                      borderRadius: 8,
                      backgroundColor: isUser ? '#fff' : '#1890ff',
                      color: isUser ? '#333' : '#fff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      wordBreak: 'break-all',
                    }}
                  >
                    <div>{msg.content}</div>
                    <div style={{ fontSize: '10px', color: isUser ? '#999' : '#e6f7ff', textAlign: 'right', marginTop: 4 }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <Card size="small" styles={{ body: { padding: '8px' } }} style={{ borderRadius: 0, borderTop: '1px solid #d9d9d9' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input.TextArea
              placeholder="请输入客服回复（粉丝在48小时内有交互方可送达）"
              rows={2}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              style={{ height: 'auto' }}
            />
          </div>
        </Card>
      </Drawer>
    </div>
  );
}
