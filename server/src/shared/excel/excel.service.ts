import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import * as XLSX from 'xlsx';

export interface ExcelColumn<T = any> {
  header: string;
  key: string;
  width?: number;
  formatter?: (row: T) => any;
}

@Injectable()
export class ExcelService {
  /**
   * 将结构化数据导出为 Excel (.xlsx) Buffer
   */
  exportToBuffer<T extends Record<string, any>>(
    rows: T[],
    columns: ExcelColumn<T>[],
    sheetName = 'Sheet1',
  ): Buffer {
    const headers = columns.map((c) => c.header);
    const dataRows = rows.map((row) =>
      columns.map((col) => {
        const val = col.formatter ? col.formatter(row) : row?.[col.key];
        if (val instanceof Date) {
          return val.toISOString().replace('T', ' ').slice(0, 19);
        }
        return val ?? '';
      }),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
    worksheet['!cols'] = columns.map((col) => ({
      wch: col.width ?? Math.max(col.header.length * 2 + 4, 14),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const out = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return Buffer.isBuffer(out) ? out : Buffer.from(out);
  }

  /**
   * 直接向 Express Response 写出 Excel 下载响应（配合 @Keep() 使用）
   */
  sendExcelResponse<T extends Record<string, any>>(
    res: Response,
    filename: string,
    rows: T[],
    columns: ExcelColumn<T>[],
    sheetName = 'Sheet1',
  ): void {
    const buffer = this.exportToBuffer(rows, columns, sheetName);
    const finalName = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    const encodedName = encodeURIComponent(finalName);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }

  /**
   * 解析上传的 Excel 文件 Buffer，返回首个 Sheet 的对象数组
   */
  parseExcelBuffer(buffer: Buffer): Record<string, any>[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return [];
    }
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: '',
    });
  }
}
