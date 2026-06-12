'use client';

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { List, CreateButton, EditButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Modal, Form, Input, InputNumber, Select, Tag, TreeSelect, Image, Button, Card, Checkbox, Row, Col, Divider, message } from 'antd';
import { useTable, useForm, useSelect } from '@refinedev/antd';
import { useList } from '@refinedev/core';
import { ShoppingOutlined, PlusOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';

interface SkuProperty {
  propertyId: number;
  propertyName: string;
  valueId: number;
  valueName: string;
}

interface SkuData {
  id?: number;
  properties: SkuProperty[];
  price: number; // In cents for backend, decimal in state during editing
  marketPrice?: number;
  costPrice?: number;
  stock: number;
  picUrl?: string;
  barCode?: string;
}

interface SelectedSpec {
  propertyId: number;
  propertyName: string;
  selectedValues: { id: number; value: string }[];
}

export default function SpuList() {
  // 1. Refine table hooks
  const { tableProps } = useTable({
    resource: 'mall/spu',
    syncWithLocation: true,
  });

  // 2. Modals & Forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [form] = Form.useForm();

  // 3. Select list data providers
  const { query: propertiesQuery } = useList({
    resource: 'mall/property',
  });
  const propertiesList = propertiesQuery?.data?.data || [];

  const { query: categoriesQuery } = useList({
    resource: 'mall/category',
  });
  const categoriesList = categoriesQuery?.data?.data || [];

  const { selectProps: brandSelectProps } = useSelect({
    resource: 'mall/brand',
    optionLabel: 'name',
    optionValue: 'id',
  });

  // 4. Specs and SKU Matrix local state
  const [selectedSpecs, setSelectedSpecs] = useState<SelectedSpec[]>([]);
  const [skuMap, setSkuMap] = useState<Record<string, Partial<SkuData>>>({});
  const [skuList, setSkuList] = useState<SkuData[]>([]);

  // 5. Refine form hooks
  const { onFinish, formLoading } = useForm({
    resource: 'mall/spu',
    action: formMode,
    id: form.getFieldValue('id'),
    onMutationSuccess: () => {
      setIsModalOpen(false);
    },
  });

  // Build category tree for TreeSelect
  const buildCategoryTree = (list: any[]) => {
    const map: any = {};
    list.forEach((c) => {
      map[c.id] = { ...c, key: c.id, value: c.id, title: c.name, children: [] };
    });
    const tree: any[] = [];
    list.forEach((c) => {
      if (c.parentId) {
        if (map[c.parentId]) {
          map[c.parentId].children.push(map[c.id]);
        } else {
          tree.push(map[c.id]);
        }
      } else {
        tree.push(map[c.id]);
      }
    });
    const cleanEmptyChildren = (nodes: any[]) => {
      nodes.forEach((n) => {
        if (n.children.length === 0) {
          delete n.children;
        } else {
          cleanEmptyChildren(n.children);
        }
      });
    };
    cleanEmptyChildren(tree);
    return tree;
  };
  const categoryTree = buildCategoryTree(categoriesList);

  const handleCreate = () => {
    setFormMode('create');
    form.resetFields();
    setSelectedSpecs([]);
    setSkuMap({});
    setSkuList([]);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setFormMode('edit');
    
    // Parse slider pic urls if they are string/array
    let sliderStr = '';
    if (record.sliderPicUrls) {
      const urls = typeof record.sliderPicUrls === 'string' ? JSON.parse(record.sliderPicUrls) : record.sliderPicUrls;
      if (Array.isArray(urls)) {
        sliderStr = urls.join('\n');
      }
    }

    form.setFieldsValue({
      ...record,
      sliderPicUrls: sliderStr,
    });

    // Initialize SKU matrix states from existing record.skus
    if (record.skus && record.skus.length > 0) {
      const specsMap: Record<number, { name: string; values: Set<number>; valueNames: Record<number, string> }> = {};
      
      record.skus.forEach((sku: any) => {
        (sku.properties || []).forEach((prop: any) => {
          if (!specsMap[prop.propertyId]) {
            specsMap[prop.propertyId] = { name: prop.propertyName, values: new Set(), valueNames: {} };
          }
          specsMap[prop.propertyId].values.add(prop.valueId);
          specsMap[prop.propertyId].valueNames[prop.valueId] = prop.valueName;
        });
      });

      const specsArray = Object.keys(specsMap).map((idStr) => {
        const id = Number(idStr);
        const val = specsMap[id];
        return {
          propertyId: id,
          propertyName: val.name,
          selectedValues: Array.from(val.values).map(vId => ({
            id: vId,
            value: val.valueNames[vId],
          })),
        };
      });
      setSelectedSpecs(specsArray);

      // Build skuMap
      const map: Record<string, any> = {};
      record.skus.forEach((sku: any) => {
        const propKey = (sku.properties || []).map((p: any) => p.valueId).sort((a: number, b: number) => a - b).join('_');
        map[propKey] = {
          ...sku,
          price: sku.price / 100, // convert to decimal for UI
          marketPrice: sku.marketPrice ? sku.marketPrice / 100 : undefined,
          costPrice: sku.costPrice ? sku.costPrice / 100 : undefined,
        };
      });
      setSkuMap(map);
    } else {
      setSelectedSpecs([]);
      setSkuMap({});
      setSkuList([]);
    }

    setIsModalOpen(true);
  };

  // Cartesian product generator
  const getCartesian = (arrays: any[][]) => {
    if (arrays.length === 0) return [[]];
    return arrays.reduce((acc, curr) => {
      return acc.flatMap(d => curr.map(e => [...d, e]));
    }, [[]]);
  };

  // Re-generate SKU list when selectedSpecs or skuMap changes
  useEffect(() => {
    if (selectedSpecs.length === 0) {
      setSkuList([]);
      return;
    }

    // Prepare lists of properties
    const activeSpecs = selectedSpecs.filter(spec => spec.selectedValues.length > 0);
    if (activeSpecs.length === 0) {
      setSkuList([]);
      return;
    }

    const valueArrays = activeSpecs.map(spec => 
      spec.selectedValues.map(val => ({
        propertyId: spec.propertyId,
        propertyName: spec.propertyName,
        valueId: val.id,
        valueName: val.value,
      }))
    );

    const combinations = getCartesian(valueArrays);

    const generatedSkus: SkuData[] = combinations.map((combo: any[]) => {
      const propKey = combo.map(p => p.valueId).sort((a: number, b: number) => a - b).join('_');
      const existing = skuMap[propKey] || {};
      return {
        properties: combo,
        price: existing.price ?? 0,
        marketPrice: existing.marketPrice,
        costPrice: existing.costPrice,
        stock: existing.stock ?? 0,
        picUrl: existing.picUrl || '',
        barCode: existing.barCode || '',
      };
    });

    setSkuList(generatedSkus);
  }, [selectedSpecs, skuMap]);

  // Update a single cell in the SKU matrix
  const updateSkuCell = (propKey: string, field: keyof SkuData, value: any) => {
    setSkuMap(prev => ({
      ...prev,
      [propKey]: {
        ...prev[propKey],
        [field]: value,
      }
    }));
  };

  // Add property spec to the selection list
  const addSpecSelection = (propertyId: number) => {
    if (selectedSpecs.some(s => s.propertyId === propertyId)) {
      message.warning('该规格已添加');
      return;
    }
    const prop = propertiesList.find((p: any) => p.id === propertyId) as any;
    if (prop) {
      setSelectedSpecs(prev => [
        ...prev,
        {
          propertyId: prop.id,
          propertyName: prop.name,
          selectedValues: [],
        }
      ]);
    }
  };

  // Remove property spec from the selection list
  const removeSpecSelection = (propertyId: number) => {
    setSelectedSpecs(prev => prev.filter(s => s.propertyId !== propertyId));
    // Also clean up skuMap
    setSkuMap({});
  };

  // Handle checking/unchecking values of a specification
  const toggleSpecValue = (propertyId: number, valueObj: { id: number; value: string }) => {
    setSelectedSpecs(prev => 
      prev.map(spec => {
        if (spec.propertyId === propertyId) {
          const exists = spec.selectedValues.some(v => v.id === valueObj.id);
          const newValues = exists 
            ? spec.selectedValues.filter(v => v.id !== valueObj.id)
            : [...spec.selectedValues, valueObj];
          return { ...spec, selectedValues: newValues };
        }
        return spec;
      })
    );
  };

  // SPU Form submit handler
  const handleFormSubmit = (values: any) => {
    // 1. Process SPU slider images (one URL per line or comma separated)
    let sliderPicUrls: string[] = [];
    if (values.sliderPicUrls) {
      sliderPicUrls = values.sliderPicUrls
        .split(/[\n,]+/)
        .map((url: string) => url.trim())
        .filter((url: string) => url !== '');
    }

    // 2. Validate SKU matrix
    if (skuList.length === 0) {
      message.error('请至少配置一个有效的 SKU（规格规格值组合）');
      return;
    }

    for (const sku of skuList) {
      if (sku.price === undefined || sku.price === null || sku.price < 0) {
        message.error('所有的 SKU 售价必须是大于等于 0 的数字');
        return;
      }
      if (sku.stock === undefined || sku.stock === null || sku.stock < 0) {
        message.error('所有的 SKU 库存必须是大于等于 0 的数字');
        return;
      }
    }

    // 3. Format SKU prices to cents (integers)
    const formattedSkus = skuList.map(sku => ({
      properties: sku.properties,
      price: Math.round(sku.price * 100), // convert to cents
      marketPrice: sku.marketPrice ? Math.round(sku.marketPrice * 100) : null,
      costPrice: sku.costPrice ? Math.round(sku.costPrice * 100) : null,
      stock: sku.stock,
      picUrl: sku.picUrl || null,
      barCode: sku.barCode || null,
    }));

    // 4. Submit SPU payload
    onFinish({
      ...values,
      sliderPicUrls,
      skus: formattedSkus,
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        headerProps={{
          extra: <CreateButton onClick={handleCreate} />,
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" width={70} />
          <Table.Column 
            dataIndex="picUrl" 
            title="商品主图" 
            width={90}
            render={(url: string) => url ? (
              <Image 
                src={url} 
                alt="商品图" 
                width={50} 
                height={50} 
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                fallback="https://placehold.co/100x100?text=No+Image"
              />
            ) : <span style={{ color: '#ccc' }}>-</span>}
          />
          <Table.Column 
            dataIndex="name" 
            title="商品名称" 
            render={(name: string) => (
              <Space>
                <ShoppingOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: '500' }}>{name}</span>
              </Space>
            )}
          />
          <Table.Column dataIndex={['category', 'name']} title="分类" width={110} />
          <Table.Column dataIndex={['brand', 'name']} title="品牌" width={110} render={(val) => val || '-'} />
          <Table.Column 
            title="价格区间" 
            width={160}
            render={(_, record: any) => {
              const minPrice = (record.minPrice / 100).toFixed(2);
              const maxPrice = (record.maxPrice / 100).toFixed(2);
              return minPrice === maxPrice ? `¥${minPrice}` : `¥${minPrice} ~ ¥${maxPrice}`;
            }}
          />
          <Table.Column dataIndex="totalStock" title="总库存" width={90} />
          <Table.Column dataIndex="sort" title="排序" width={80} />
          <Table.Column 
            dataIndex="status" 
            title="状态" 
            width={100}
            render={(status: string) => (
              <Tag color={status === 'ENABLE' ? 'green' : 'red'}>
                {status === 'ENABLE' ? '上架' : '下架'}
              </Tag>
            )}
          />
          <Table.Column
            title="操作"
            dataIndex="actions"
            width={160}
            render={(_, record: any) => (
              <Space>
                <EditButton hideText size="small" onClick={() => handleEdit(record)} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      <Modal
        title={formMode === 'create' ? '新增商品' : '编辑商品'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={formLoading}
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          {formMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="例如：华为 Mate 60 Pro" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="categoryId"
                label="商品分类"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择分类"
                  allowClear
                  treeDefaultExpandAll
                  treeData={categoryTree}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="brandId"
                label="商品品牌"
              >
                <Select placeholder="请选择品牌" allowClear {...brandSelectProps} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="picUrl"
                label="商品主图 URL"
                rules={[{ required: true, message: '请输入主图 URL' }]}
              >
                <Input placeholder="输入商品主图片 URL，如 /spu/mate60.png" prefix={<PictureOutlined />} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="sort" label="排序" initialValue={0}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="上架状态" initialValue="ENABLE">
                <Select>
                  <Select.Option value="ENABLE">上架</Select.Option>
                  <Select.Option value="DISABLE">下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="sliderPicUrls"
            label="轮播图 URLs (每行一个或逗号分隔)"
            help="输入轮播图片的 URL，多张图片请换行输入"
          >
            <Input.TextArea placeholder="/spu/mate60_1.png&#10;/spu/mate60_2.png" rows={3} />
          </Form.Item>

          <Form.Item name="description" label="商品详情描述">
            <Input.TextArea placeholder="请输入商品详情介绍" rows={4} />
          </Form.Item>

          <Divider orientation="left">规格与库存 (SKU 矩阵)</Divider>

          <Card title="第一步：选择商品规格属性" size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ marginRight: 8 }}>选择可用规格:</span>
              <Select 
                placeholder="选择规格加入" 
                style={{ width: 220 }}
                onChange={(val) => { if (val) addSpecSelection(val as number); }}
                value={undefined} // reset selection
              >
                {propertiesList.map((p: any) => (
                  <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                ))}
              </Select>
            </div>

            {selectedSpecs.map((spec) => {
              const fullProperty = propertiesList.find((p: any) => p.id === spec.propertyId) as any;
              const availableValues = fullProperty?.values || [];
              return (
                <div key={spec.propertyId} style={{ background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: 8 }}>
                  <Row align="middle">
                    <Col span={4}>
                      <strong>{spec.propertyName}:</strong>
                    </Col>
                    <Col span={18}>
                      {availableValues.map((v: any) => {
                        const isChecked = spec.selectedValues.some(item => item.id === v.id);
                        return (
                          <Checkbox 
                            key={v.id} 
                            checked={isChecked}
                            onChange={() => toggleSpecValue(spec.propertyId, { id: v.id, value: v.value })}
                            style={{ marginInlineStart: 0, marginInlineEnd: 16 }}
                          >
                            {v.value}
                          </Checkbox>
                        );
                      })}
                    </Col>
                    <Col span={2} style={{ textAlign: 'right' }}>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => removeSpecSelection(spec.propertyId)} 
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Card>

          {skuList.length > 0 && (
            <Card title="第二步：配置 SKU 详情 (Cartesian Product)" size="small">
              <Table 
                dataSource={skuList} 
                pagination={false} 
                rowKey={(record) => record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_')}
                size="small"
                scroll={{ x: 'max-content' }}
              >
                {/* Dynamically render spec columns */}
                {selectedSpecs.map((spec) => (
                  <Table.Column 
                    key={spec.propertyId}
                    title={spec.propertyName}
                    render={(_, record: SkuData) => {
                      const prop = record.properties.find(p => p.propertyId === spec.propertyId);
                      return prop ? <Tag color="blue">{prop.valueName}</Tag> : '-';
                    }}
                  />
                ))}

                <Table.Column 
                  title={<span style={{ color: '#ff4d4f' }}>售价 (元)*</span>}
                  width={130}
                  render={(_, record: SkuData) => {
                    const propKey = record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_');
                    return (
                      <InputNumber 
                        min={0} 
                        precision={2} 
                        style={{ width: '100%' }}
                        value={record.price}
                        onChange={(val) => updateSkuCell(propKey, 'price', val)}
                      />
                    );
                  }}
                />

                <Table.Column 
                  title="市场价 (元)"
                  width={130}
                  render={(_, record: SkuData) => {
                    const propKey = record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_');
                    return (
                      <InputNumber 
                        min={0} 
                        precision={2} 
                        style={{ width: '100%' }}
                        value={record.marketPrice}
                        onChange={(val) => updateSkuCell(propKey, 'marketPrice', val)}
                      />
                    );
                  }}
                />

                <Table.Column 
                  title="成本价 (元)"
                  width={130}
                  render={(_, record: SkuData) => {
                    const propKey = record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_');
                    return (
                      <InputNumber 
                        min={0} 
                        precision={2} 
                        style={{ width: '100%' }}
                        value={record.costPrice}
                        onChange={(val) => updateSkuCell(propKey, 'costPrice', val)}
                      />
                    );
                  }}
                />

                <Table.Column 
                  title={<span style={{ color: '#ff4d4f' }}>库存*</span>}
                  width={110}
                  render={(_, record: SkuData) => {
                    const propKey = record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_');
                    return (
                      <InputNumber 
                        min={0} 
                        precision={0} 
                        style={{ width: '100%' }}
                        value={record.stock}
                        onChange={(val) => updateSkuCell(propKey, 'stock', val)}
                      />
                    );
                  }}
                />

                <Table.Column 
                  title="条形码"
                  width={150}
                  render={(_, record: SkuData) => {
                    const propKey = record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_');
                    return (
                      <Input 
                        placeholder="Barcode"
                        value={record.barCode}
                        onChange={(e) => updateSkuCell(propKey, 'barCode', e.target.value)}
                      />
                    );
                  }}
                />

                <Table.Column 
                  title="SKU 图片 URL"
                  width={180}
                  render={(_, record: SkuData) => {
                    const propKey = record.properties.map(p => p.valueId).sort((a, b) => a - b).join('_');
                    return (
                      <Input 
                        placeholder="Image URL"
                        value={record.picUrl}
                        onChange={(e) => updateSkuCell(propKey, 'picUrl', e.target.value)}
                      />
                    );
                  }}
                />
              </Table>
            </Card>
          )}
        </Form>
      </Modal>
    </div>
  );
}
