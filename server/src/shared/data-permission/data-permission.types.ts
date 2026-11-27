export enum DataScope {
  /** 全部数据权限 */
  ALL = 1,
  /** 指定部门数据权限 */
  DEPT_CUSTOM = 2,
  /** 本部门数据权限 */
  DEPT_ONLY = 3,
  /** 本部门及以下数据权限 */
  DEPT_AND_CHILD = 4,
  /** 仅本人数据权限 */
  SELF = 5,
}

export interface DeptDataPermission {
  all: boolean;
  self: boolean;
  deptIds: number[];
}
