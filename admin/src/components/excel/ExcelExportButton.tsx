import React, { useState } from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useDataProvider } from '@refinedev/core';
import * as XLSX from 'xlsx';

export interface ExportColumn {
  title: string;
  dataIndex: string | string[];
  render?: (value: any, record: any) => any;
}

interface ExcelExportButtonProps {
  resource?: string;
  data?: any[];
  columns: ExportColumn[];
  filename?: string;
  buttonText?: string;
  filters?: any;
  sorters?: any;
}

const getNestedValue = (obj: any, path: string | string[]) => {
  if (!obj) return '';
  const parts = Array.isArray(path) ? path : path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return '';
    current = current[part];
  }
  return current ?? '';
};

export const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  resource,
  data,
  columns,
  filename,
  buttonText = '导出 Excel',
  filters,
  sorters,
}) => {
  const [loading, setLoading] = useState(false);
  const dataProvider = useDataProvider();

  const handleExport = async () => {
    setLoading(true);
    try {
      let rawData: any[] = [];
      if (data) {
        rawData = data;
      } else if (resource) {
        // 使用 Refine DataProvider 获取全量数据进行导出
        const activeDataProvider = dataProvider();
        if (!activeDataProvider.getList) {
          throw new Error('当前 Data Provider 不支持 getList 方法');
        }
        const response = await activeDataProvider.getList({
          resource,
          pagination: { mode: 'off' },
          filters,
          sorters,
        });
        rawData = response.data;
      }

      if (rawData.length === 0) {
        message.warning('没有可导出的数据！');
        setLoading(false);
        return;
      }

      // 将 JSON 扁平化映射
      const exportData = rawData.map((item) => {
        const row: Record<string, any> = {};
        columns.forEach((col) => {
          const val = getNestedValue(item, col.dataIndex);
          row[col.title] = col.render ? col.render(val, item) : val;
        });
        return row;
      });

      // 用 SheetJS 写入
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${filename || resource?.replace('/', '_') || 'export'}.xlsx`);
      message.success('导出 Excel 成功！');
    } catch (err: any) {
      console.error('Failed to export:', err);
      message.error(`导出失败: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="default"
      icon={<DownloadOutlined />}
      loading={loading}
      onClick={handleExport}
    >
      {buttonText}
    </Button>
  );
};
