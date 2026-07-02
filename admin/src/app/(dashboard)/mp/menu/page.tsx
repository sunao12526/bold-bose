'use client';
export const dynamic = "force-dynamic";
import React from 'react';
import { Card, Space, Button, Form, Input, Select, Popconfirm, message, Alert, Empty } from 'antd';
import { SyncOutlined, SaveOutlined, PlusOutlined, DeleteOutlined, MobileOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../../lib/axios';

// 临时菜单节点的 TypeScript 结构
interface MenuItem {
  tempId: string;       // 临时唯一标识
  id?: number;          // 数据库实际 ID (同步时或保存后会有)
  parentId?: string;    // 父级 tempId
  name: string;
  type?: string;        // VIEW, CLICK, MINIPROGRAM
  url?: string;
  menuKey?: string;
  miniProgramAppId?: string;
  miniProgramPagePath?: string;
  sort: number;
}

export default function MpMenuEditor() {
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<number | null>(null);
  
  // 本地编辑的扁平菜单状态
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [selectedTempId, setSelectedTempId] = React.useState<string | null>(null);
  
  const [loading, setLoading] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [form] = Form.useForm();

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

  // 2. 加载公众号本地数据库的菜单
  const loadDbMenus = async (accountId: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/mp/menu?accountId=${accountId}`);
      const list = res.data?.data || res.data || [];
      
      // 我们需要把数据库菜单转换为带 tempId 的本地 MenuItem 结构
      const mapped: MenuItem[] = list.map((item: any) => ({
        tempId: `db_${item.id}`,
        id: item.id,
        parentId: item.parentId ? `db_${item.parentId}` : undefined,
        name: item.name,
        type: item.type || undefined,
        url: item.url || undefined,
        menuKey: item.menuKey || undefined,
        miniProgramAppId: item.miniProgramAppId || undefined,
        miniProgramPagePath: item.miniProgramPagePath || undefined,
        sort: item.sort || 0,
      }));
      setMenuItems(mapped);
      setSelectedTempId(null);
    } catch {
      message.error('加载本地菜单失败');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedAccountId !== null) {
      loadDbMenus(selectedAccountId);
    }
  }, [selectedAccountId]);

  // 3. 当选中的菜单发生变化时，同步更新表单
  React.useEffect(() => {
    if (selectedTempId) {
      const selected = menuItems.find(m => m.tempId === selectedTempId);
      if (selected) {
        form.setFieldsValue(selected);
      }
    } else {
      form.resetFields();
    }
  }, [selectedTempId, menuItems]);

  // 获取一级菜单 (按 sort 排序)
  const getParentMenus = () => {
    return menuItems.filter(m => !m.parentId).sort((a, b) => a.sort - b.sort);
  };

  // 获取某个一级菜单下的二级子菜单 (按 sort 排序)
  const getSubMenus = (parentTempId: string) => {
    return menuItems.filter(m => m.parentId === parentTempId).sort((a, b) => a.sort - b.sort);
  };

  // 4. 添加菜单节点
  const handleAddParentMenu = () => {
    const parents = getParentMenus();
    if (parents.length >= 3) {
      message.warning('微信公众号最多允许 3 个一级菜单');
      return;
    }
    const tempId = `temp_${Date.now()}`;
    const newMenu: MenuItem = {
      tempId,
      name: '新建菜单',
      sort: parents.length + 1,
    };
    setMenuItems([...menuItems, newMenu]);
    setSelectedTempId(tempId);
  };

  const handleAddSubMenu = (parentTempId: string) => {
    const subs = getSubMenus(parentTempId);
    if (subs.length >= 5) {
      message.warning('微信公众号每个一级菜单下最多 5 个二级菜单');
      return;
    }
    const tempId = `temp_${Date.now()}`;
    const newSub: MenuItem = {
      tempId,
      parentId: parentTempId,
      name: '新建子菜单',
      type: 'VIEW', // 子菜单默认跳转网页
      url: 'https://',
      sort: subs.length + 1,
    };
    
    // 如果父菜单之前配置了 type/url 等，增加子菜单后需自动清除父菜单的 type (因为有子菜单的一级菜单微信不接受 type 等具体动作属性)
    const updated = menuItems.map(m => {
      if (m.tempId === parentTempId) {
        return { ...m, type: undefined, url: undefined, menuKey: undefined, miniProgramAppId: undefined, miniProgramPagePath: undefined };
      }
      return m;
    });

    setMenuItems([...updated, newSub]);
    setSelectedTempId(tempId);
  };

  // 5. 删除菜单节点
  const handleDeleteMenu = (tempId: string) => {
    // 如果删除的是一级菜单，其下的所有二级菜单也一并删除
    const toDeleteIds = [tempId, ...menuItems.filter(m => m.parentId === tempId).map(m => m.tempId)];
    const filtered = menuItems.filter(m => !toDeleteIds.includes(m.tempId));
    setMenuItems(filtered);
    setSelectedTempId(null);
  };

  // 6. 表单属性变动更新至状态树
  const handleFormChange = (changedValues: any) => {
    if (!selectedTempId) return;
    const updated = menuItems.map(m => {
      if (m.tempId === selectedTempId) {
        return { ...m, ...changedValues };
      }
      return m;
    });
    setMenuItems(updated);
  };

  // 7. 保存并发布至微信端
  const handleSaveAndPublish = async () => {
    if (!selectedAccountId) return;
    setPublishing(true);
    try {
      // 第一步：清空并批量重构本地库菜单数据
      // 我们先查出本地原先的数据库菜单 ID 列表以清空它们
      const res = await axiosInstance.get(`/mp/menu?accountId=${selectedAccountId}`);
      const dbList = res.data?.data || res.data || [];
      for (const item of dbList) {
        await axiosInstance.delete(`/mp/menu/${item.id}`);
      }

      // 第二步：写入新定义的菜单树
      const parents = getParentMenus();
      for (const parent of parents) {
        // 创建一级菜单
        const resParent = await axiosInstance.post('/mp/menu', {
          accountId: selectedAccountId,
          appId: accounts.find(a => a.id === selectedAccountId)?.appId,
          name: parent.name,
          type: parent.type || null,
          menuKey: parent.menuKey || null,
          url: parent.url || null,
          miniProgramAppId: parent.miniProgramAppId || null,
          miniProgramPagePath: parent.miniProgramPagePath || null,
          sort: parent.sort,
        });
        const savedParent = resParent.data?.data || resParent.data;

        // 创建其二级菜单
        const subs = getSubMenus(parent.tempId);
        for (const sub of subs) {
          await axiosInstance.post('/mp/menu', {
            accountId: selectedAccountId,
            appId: accounts.find(a => a.id === selectedAccountId)?.appId,
            name: sub.name,
            parentId: savedParent.id,
            type: sub.type || null,
            menuKey: sub.menuKey || null,
            url: sub.url || null,
            miniProgramAppId: sub.miniProgramAppId || null,
            miniProgramPagePath: sub.miniProgramPagePath || null,
            sort: sub.sort,
          });
        }
      }

      // 第三步：一键发布自定义菜单下发到微信
      await axiosInstance.post(`/mp/menu/publish?accountId=${selectedAccountId}`);
      message.success('菜单配置保存并成功下发到粉丝微信中！');
      loadDbMenus(selectedAccountId);
    } catch (e: any) {
      message.error(e.response?.data?.message || '发布菜单失败，请核对小程序 AppId 或菜单链接格式');
    } finally {
      setPublishing(false);
    }
  };

  // 8. 从微信端同步拉取
  const handleSyncFromWechat = async () => {
    if (!selectedAccountId) return;
    setSyncing(true);
    try {
      await axiosInstance.post(`/mp/menu/sync?accountId=${selectedAccountId}`);
      message.success('成功从微信官方拉取菜单配置到本地！');
      loadDbMenus(selectedAccountId);
    } catch (e: any) {
      message.error(e.response?.data?.message || '微信端无自定义菜单或同步失败');
    } finally {
      setSyncing(false);
    }
  };

  // 辅助变量：获得当前选中菜单的详情
  const selectedMenu = menuItems.find(m => m.tempId === selectedTempId);
  const selectedHasChildren = selectedMenu ? menuItems.some(m => m.parentId === selectedMenu.tempId) : false;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <span>选择管理的公众号：</span>
          <Select
            style={{ width: 220 }}
            placeholder="选择公众号"
            value={selectedAccountId}
            onChange={(v) => setSelectedAccountId(v)}
            options={accounts.map((a) => ({ label: a.name, value: a.id }))}
          />
        </Space>
        <Space>
          <Button icon={<SyncOutlined spin={syncing} />} onClick={handleSyncFromWechat} loading={syncing}>
            同步微信菜单
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveAndPublish} loading={publishing}>
            保存并下发微信
          </Button>
        </Space>
      </div>

      <Alert
        message="温馨提示"
        description="修改并保存菜单配置后，请点击右上角【保存并下发微信】才会真正在手机端生效。一级菜单若有二级菜单，则一级菜单的事件属性（跳转、点击等）会被自动忽略。"
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* 1. 左侧手机菜单栏模拟器 */}
        <div
          style={{
            width: 320,
            height: 560,
            border: '1px solid #d9d9d9',
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 手机状态栏预览 */}
          <div style={{ height: 40, backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', fontSize: 12 }}>
            <span><MobileOutlined /> 微信公众号</span>
            <span>12:00</span>
          </div>
          
          {/* 中间假会话框 */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf', fontSize: 13 }}>
            会话预览区
          </div>

          {/* 底部微信菜单 */}
          <div
            style={{
              height: 50,
              borderTop: '1px solid #e8e8e8',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* 左侧键盘小图标 */}
            <div style={{ width: 44, height: '100%', borderRight: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', cursor: 'not-allowed' }}>
              ⌨️
            </div>

            {/* 1-3个一级菜单 */}
            <div style={{ flex: 1, display: 'flex', height: '100%' }}>
              {getParentMenus().map((parent) => {
                const isSelected = selectedTempId === parent.tempId;
                const subs = getSubMenus(parent.tempId);

                return (
                  <div
                    key={parent.tempId}
                    style={{
                      flex: 1,
                      height: '100%',
                      borderRight: '1px solid #e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      fontSize: 13,
                      fontWeight: isSelected ? 'bold' : 'normal',
                      backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                      border: isSelected ? '1px solid #1890ff' : 'none',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTempId(parent.tempId);
                    }}
                  >
                    {subs.length > 0 && <span style={{ marginRight: 2, fontSize: 10 }}>☰</span>}
                    {parent.name}

                    {/* 二级悬浮子菜单气泡 (仅在当前高亮且子菜单有项或被点击时展现) */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 56,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 100,
                          backgroundColor: '#fff',
                          border: '1px solid #d9d9d9',
                          borderRadius: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          display: 'flex',
                          flexDirection: 'column-reverse',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* 添加二级按钮 */}
                        {subs.length < 5 && (
                          <div
                            style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid #f0f0f0', color: '#1890ff', cursor: 'pointer', fontSize: 12 }}
                            onClick={() => handleAddSubMenu(parent.tempId)}
                          >
                            <PlusOutlined />
                          </div>
                        )}
                        {/* 列表展现二级菜单 */}
                        {subs.map((sub) => {
                          const isSubSelected = selectedTempId === sub.tempId;
                          return (
                            <div
                              key={sub.tempId}
                              style={{
                                padding: '10px 8px',
                                textAlign: 'center',
                                borderBottom: '1px solid #f0f0f0',
                                backgroundColor: isSubSelected ? '#e6f7ff' : 'transparent',
                                fontWeight: isSubSelected ? 'bold' : 'normal',
                                fontSize: 12,
                                color: isSubSelected ? '#1890ff' : '#333',
                                cursor: 'pointer',
                              }}
                              onClick={() => setSelectedTempId(sub.tempId)}
                            >
                              {sub.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 添加一级按钮 */}
              {getParentMenus().length < 3 && (
                <div
                  style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#1890ff',
                  }}
                  onClick={handleAddParentMenu}
                >
                  <PlusOutlined />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. 右侧配置 Form 表单面板 */}
        <Card
          title={selectedMenu ? `配置菜单: ${selectedMenu.name}` : '菜单配置属性'}
          style={{ flex: 1, minWidth: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}
          extra={
            selectedTempId && (
              <Popconfirm title="确认删除当前选中的菜单（及其下的子菜单）？" onConfirm={() => handleDeleteMenu(selectedTempId)}>
                <Button size="small" danger icon={<DeleteOutlined />}>删除菜单</Button>
              </Popconfirm>
            )
          }
        >
          {selectedMenu ? (
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
            >
              <Form.Item name="name" label="菜单名称" rules={[{ required: true, message: '菜单名称不能为空' }]}>
                <Input maxLength={7} placeholder="一级最长4个字，二级最长7个字" />
              </Form.Item>

              {/* 如果当前一级菜单有二级菜单，则不需要配置动作，只有当无子菜单时才配置 type */}
              {!selectedHasChildren ? (
                <>
                  <Form.Item name="type" label="响应动作类型" initialValue="VIEW">
                    <Select>
                      <Select.Option value="VIEW">VIEW (跳转网页链接)</Select.Option>
                      <Select.Option value="CLICK">CLICK (点击触发自动回复/关键字)</Select.Option>
                      <Select.Option value="MINIPROGRAM">MINIPROGRAM (打开微信小程序)</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
                    {({ getFieldValue }) => {
                      const type = getFieldValue('type');
                      if (type === 'VIEW') {
                        return (
                          <Form.Item name="url" label="网页链接 URL" rules={[{ required: true, message: '请配置跳转链接' }]}>
                            <Input placeholder="输入以 http:// 或 https:// 开头的链接" />
                          </Form.Item>
                        );
                      }
                      if (type === 'CLICK') {
                        return (
                          <Form.Item name="menuKey" label="触发关键字 / KEY" rules={[{ required: true, message: '请配置关键字' }]}>
                            <Input placeholder="在自动回复中配置该关键字可触发对应回复内容" />
                          </Form.Item>
                        );
                      }
                      if (type === 'MINIPROGRAM') {
                        return (
                          <>
                            <Form.Item name="url" label="备用网页链接" rules={[{ required: true, message: '旧微信版本不支持小程序时跳转的备用URL' }]}>
                              <Input placeholder="输入 https:// 链接" />
                            </Form.Item>
                            <Form.Item name="miniProgramAppId" label="小程序 AppId" rules={[{ required: true, message: '小程序AppId不能为空' }]}>
                              <Input placeholder="如 wxe1234567..." />
                            </Form.Item>
                            <Form.Item name="miniProgramPagePath" label="小程序页面 Path" rules={[{ required: true, message: '页面路径不能为空' }]}>
                              <Input placeholder="如 pages/index/index" />
                            </Form.Item>
                          </>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>
                </>
              ) : (
                <div style={{ color: '#8c8c8c', padding: '12px', border: '1px dashed #d9d9d9', borderRadius: 4, backgroundColor: '#fafafa' }}>
                  💡 该菜单目前配置有二级菜单，微信规定此时一级菜单只能用于容器展示，无法直接绑定点击或跳转事件。
                </div>
              )}
            </Form>
          ) : (
            <div style={{ padding: '40px 0' }}>
              <Empty description="请在左侧的手机模拟底栏中点击选中或创建菜单进行配置" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
