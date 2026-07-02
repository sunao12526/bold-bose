# 任务跟踪列表 (Excel 导入与导出开发)

- [x] **任务一：安装 Excel 前端处理库**
  - [x] 在 `admin` 目录下运行 `npm install xlsx` 安装 SheetJS 依赖。
- [x] **任务二：封装通用的 ExcelExportButton 组件**
  - [x] 在 `admin/src/components/excel` 下创建 `ExcelExportButton.tsx`，支持多字段、嵌套字段、自定义渲染和基于 dataProvider 全量异步获取数据。
- [x] **任务三：封装通用的 ExcelImportButton 组件**
  - [x] 在 `admin/src/components/excel` 下创建 `ExcelImportButton.tsx`，支持将 Excel 翻译并导入为 JSON，包含上传拦截、导入进度条 Modal 以及详细行错误搜集显示。
- [x] **任务四：在系统功能各个列表页面挂载通用组件**
  - [x] 用户管理页面：挂载导出与批量导入按钮（预设密码逻辑）。
  - [x] 岗位管理页面：挂载导出与批量导入按钮。
  - [x] 角色管理页面：挂载导出按钮。
  - [x] 部门管理页面：挂载导出按钮（包含嵌套 leader 的解析）。
  - [x] 参数配置页面：挂载导出按钮。
  - [x] 字典管理页面：分别在字典类型与字典数据右侧挂载导出按钮（支持过滤）。
  - [x] 登录日志页面：挂载导出按钮（导出 IP 定位地理位置）。
  - [x] 操作日志页面：挂载导出按钮（导出 IP 定位地理位置）。
- [x] **任务五：前端项目整体构建与验证**
  - [x] 在 `admin` 目录下运行 `npm run build`，Next.js 完美构建完成，62/62 路由打包全绿通过！
