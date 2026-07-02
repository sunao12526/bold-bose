import React, { useState, useRef } from 'react';
import { Button, Upload, Modal, Progress, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../lib/axios';
import * as XLSX from 'xlsx';

export interface ImportColumn {
  title: string;
  dataIndex: string;
}

interface ExcelImportButtonProps {
  resource: string;
  columns: ImportColumn[];
  onSuccess?: () => void;
  prepareData?: (data: any[]) => any[];
  buttonText?: string;
}

export const ExcelImportButton: React.FC<ExcelImportButtonProps> = ({
  resource,
  columns,
  onSuccess,
  prepareData,
  buttonText = '导入 Excel',
}) => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    setImporting(true);
    setProgress({ current: 0, total: 0 });
    setIsModalOpen(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

          if (rawJson.length === 0) {
            message.warning('Excel 中未检测到有效数据！');
            setIsModalOpen(false);
            setImporting(false);
            return;
          }

          // 列头映射翻译为字段
          let parsedData = rawJson.map((row) => {
            const item: Record<string, any> = {};
            columns.forEach((col) => {
              const val = row[col.title];
              if (val !== undefined) {
                item[col.dataIndex] = val;
              }
            });
            return item;
          });

          // 支持前置处理器（用来插入默认字段、类型转换等）
          if (prepareData) {
            parsedData = prepareData(parsedData);
          }

          setProgress({ current: 0, total: parsedData.length });

          let successCount = 0;
          let failCount = 0;
          const errors: string[] = [];

          // 循环异步发送请求，并实时汇报进度
          for (let i = 0; i < parsedData.length; i++) {
            try {
              await axiosInstance.post(`/${resource}`, parsedData[i]);
              successCount++;
            } catch (err: any) {
              failCount++;
              errors.push(
                `第 ${i + 2} 行 [数据: ${JSON.stringify(parsedData[i])}]: ${
                  err.response?.data?.message || err.message
                }`,
              );
            }
            setProgress((prev) => ({ ...prev, current: i + 1 }));
          }

          setIsModalOpen(false);

          if (failCount === 0) {
            message.success(`成功导入 ${successCount} 条数据！`);
          } else {
            Modal.error({
              title: '导入完成（存在部分失败）',
              width: 600,
              content: (
                <div>
                  <p>
                    成功: <strong style={{ color: 'green' }}>{successCount}</strong> 条，失败:{' '}
                    <strong style={{ color: 'red' }}>{failCount}</strong> 条。
                  </p>
                  <p>错误详情明细：</p>
                  <div
                    style={{
                      maxHeight: '220px',
                      overflowY: 'auto',
                      background: '#fafafa',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    {errors.map((err, idx) => (
                      <div key={idx} style={{ color: 'red', fontSize: '12px', marginBottom: '4px' }}>
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            });
          }

          if (onSuccess) {
            onSuccess();
          }
        } catch (err: any) {
          console.error(err);
          message.error('解析 Excel 文件出错，请检查格式');
          setIsModalOpen(false);
        } finally {
          setImporting(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      message.error(`读取文件失败: ${err.message || err}`);
      setIsModalOpen(false);
      setImporting(false);
    }
  };

  return (
    <>
      <Upload
        beforeUpload={(file) => {
          handleImport(file);
          return false; // 阻断默认上传逻辑，由前端手动接管
        }}
        showUploadList={false}
        accept=".xlsx,.xls"
        disabled={importing}
      >
        <Button icon={<UploadOutlined />} disabled={importing}>
          {buttonText}
        </Button>
      </Upload>

      <Modal
        title="正在导入 Excel 数据"
        open={isModalOpen}
        closable={false}
        maskClosable={false}
        footer={null}
        destroyOnClose
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Progress
            type="circle"
            percent={
              progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0
            }
          />
          <div style={{ marginTop: '16px', fontSize: '14px' }}>
            正在处理中： {progress.current} / {progress.total}
          </div>
        </div>
      </Modal>
    </>
  );
};
